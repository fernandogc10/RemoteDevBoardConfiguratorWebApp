const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logMessageSchema = new Schema({
  board: { type: Schema.Types.ObjectId, ref: "Board" },
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
});

const LogMessage = mongoose.model("LogMessage", logMessageSchema);

module.exports = LogMessage;
