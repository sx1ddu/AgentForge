import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";
import { errorHandler } from "../../shared/errors/errorHandler.js";

dotenv.config();

const port = process.env.PORT || 8001;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", service: "auth", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from AgentForge Auth Service", status: "healthy" });
});

app.use("/", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Auth service started at port: ${port}`);
  connectDB();
});

export default app;
