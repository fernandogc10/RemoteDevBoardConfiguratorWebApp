const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  Device: { type: String, required: true },
  Ip: { type: String, required: true },
  parameters: {
    type: Map,
    of: String,
  },
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
