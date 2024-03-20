const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
});

const Board = mongoose.model("Board", accountSchema);
module.exports = Board;
