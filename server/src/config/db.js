var mongoose = require("mongoose");

const connectDB = () =>
  mongoose
    .connect(
      "mongodb://root:example@localhost:27017/rdbc_db?authSource=admin",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB Docker connection successful"))
    .catch((err) => console.error("MongoDB connection error:", err));

module.exports = connectDB;
