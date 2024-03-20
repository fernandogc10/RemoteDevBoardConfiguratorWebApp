const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const board = require("./src/routes/board.js");

const connectDB = require("./src/config/db.js");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB().then(() => {
  connectMQTT();
});
app.use(cors());
app.use(bodyParser.json());
app.use("/boards", board);
