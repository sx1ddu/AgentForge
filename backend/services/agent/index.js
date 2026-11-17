import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import { router } from "./routes/agent.route.js";
import { errorHandler } from "../../shared/errors/errorHandler.js";

const port = process.env.PORT || 8003;

const app = express();

app.use(express.json({ limit: "25mb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", service: "agent", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from AgentForge Agent Service", status: "healthy" });
});

app.use("/", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Agent service started at port: ${port}`);
  connectDB();
});

export default app;
