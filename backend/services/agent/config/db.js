import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agentforge";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("Agent Service: MongoDB connected successfully");
  } catch (error) {
    console.error("Agent Service: MongoDB connection error:", error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("Agent Service: MongoDB disconnected");
});

export default connectDB;
