import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.routes.js";
import { errorHandler } from "../../shared/errors/errorHandler.js";

dotenv.config();

const port = process.env.PORT || 8002;

const app = express();

app.use(express.json({ limit: "25mb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", service: "chat", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from AgentForge Chat Service", status: "healthy" });
});

app.use("/", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Chat service started at port: ${port}`);
  connectDB();
});

export default app;
