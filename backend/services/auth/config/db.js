import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agentforge";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("Auth Service: MongoDB connected successfully");
  } catch (error) {
    console.error("Auth Service: MongoDB connection error:", error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("Auth Service: MongoDB disconnected");
});

export default connectDB;
