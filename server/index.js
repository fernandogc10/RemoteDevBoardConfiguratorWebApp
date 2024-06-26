const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const board = require("./src/routes/board.js");
const user = require("./src/routes/user.js");
const connectDB = require("./src/config/db.js");
const connectMQTT = require("./src/config/mqtt.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    const mqttClient = connectMQTT();

    app.use("/users", user);

    app.use(
      "/boards",
      (req, res, next) => {
        req.mqttClient = mqttClient;
        next();
      },
      board
    );

    app.listen(PORT, () => console.log(`Server running in port:  ${PORT}`));
  })
  .catch((err) => {
    console.error("Error while trying to connect to MongoDB:", err);
  });
