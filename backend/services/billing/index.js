import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./route/billing.route.js";
import { errorHandler } from "../../shared/errors/errorHandler.js";

dotenv.config();

const port = process.env.PORT || 8004;

const app = express();

// Webhook raw body parser MUST be mounted before global express.json()
app.use("/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", service: "billing", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from AgentForge Billing Service", status: "healthy" });
});

app.use("/", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Billing service started at port: ${port}`);
  connectDB();
});

export default app;
