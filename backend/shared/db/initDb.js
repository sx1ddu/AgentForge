import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agentforge";

export const initializeDatabase = async () => {
  console.log(`Connecting to MongoDB at: ${uri}`);
  await mongoose.connect(uri);

  const db = mongoose.connection.db;

  console.log("Applying database indexes for AgentForge...");

  // 1. Users collection indexes
  await db.collection("users").createIndex({ firebaseUid: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 });
  console.log("✓ User indexes created: firebaseUid (unique), email");

  // 2. Conversations collection indexes
  await db.collection("conversations").createIndex({ userId: 1, updatedAt: -1 });
  console.log("✓ Conversation indexes created: { userId: 1, updatedAt: -1 }");

  // 3. Messages collection indexes
  await db.collection("messages").createIndex({ conversationId: 1, createdAt: 1 });
  console.log("✓ Message indexes created: { conversationId: 1, createdAt: 1 }");

  // 4. Payments collection indexes
  await db.collection("payments").createIndex({ orderId: 1 }, { unique: true });
  await db.collection("payments").createIndex({ userId: 1, createdAt: -1 });
  console.log("✓ Payment indexes created: orderId (unique), { userId: 1, createdAt: -1 }");

  console.log("AgentForge Database Initialization Complete!");
};

// Allow standalone CLI execution: node shared/db/initDb.js
if (process.argv[1]?.endsWith("initDb.js")) {
  initializeDatabase()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Initialization error:", err);
      process.exit(1);
    });
}
