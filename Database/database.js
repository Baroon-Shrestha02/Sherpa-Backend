const mongoose = require("mongoose");

const mongoDB_URI = process.env.URI;

const database = async () => {
  try {
    await mongoose.connect(mongoDB_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { database };
