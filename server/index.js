const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./src/config/db.js");

const PORT = process.env.PORT || 8080;

connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors());
app.use(bodyParser.json());
