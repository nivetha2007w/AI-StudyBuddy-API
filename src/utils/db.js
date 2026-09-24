const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const defaultMongoUri = "mongodb://localhost:27017/ai-studybuddy";

const resolveMongoUri = () => {
  const uri = process.env.MONGO_URI || defaultMongoUri;
  if (!uri || uri.includes("<your_")) return defaultMongoUri;
  return uri;
};

const connectDB = async () => {
  const mongoUri = resolveMongoUri();
  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
