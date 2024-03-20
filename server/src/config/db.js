var mongoose = require("mongoose");

const connectDB = () =>
  mongoose
    .connect("mongodb://localhost:27017/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Docker connection successful"))
    .catch((err) => console.error("MongoDB connection error:", err));

module.exports = connectDB;
