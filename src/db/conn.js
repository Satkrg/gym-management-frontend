require('dotenv').config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SECRET_KEY_1, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB URI:", process.env.SECRET_KEY_1);

    console.log("Connection to MongoDB Successful");
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
  }
};

module.exports = connectDB;


// Example schema definition
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true, index: true }, // Index created for the "name" field
//     email: { type: String, required: true, unique: true, index: true } // Index created for the "email" field
// });

// Rest of your code...
