const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const board = require("./src/routes/board.js");
const connectDB = require("./src/config/db.js");
const connectMQTT = require("./mqttClient");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use("/boards", board);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    connectMQTT();

    app.listen(PORT, () => console.log(`Server running in port:  ${PORT}`));
  })
  .catch((err) => {
    console.error("Error while trying to connect to MongoDB:", err);
  });
