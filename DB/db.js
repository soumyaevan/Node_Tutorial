const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("Database is connected successfully");
  } catch (error) {
    console.error("database connection is failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
