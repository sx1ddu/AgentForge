import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controllers.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// 1. Stripe Webhook Proxy: MUST be mounted BEFORE express.json() to preserve raw body bytes
app.use(
  "/api/billing/webhook",
  proxy(process.env.BILLING_SERVICE || "http://localhost:8004", {
    proxyReqPathResolver: () => "/webhook",
    parseReqBody: false,
    reqBodyEncoding: null,
    timeout: 30000,
  })
);

// 2. Global Parsers & Security Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://d30q6oug5r2j6s.cloudfront.net",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow in dev
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));

// 3. Healthcheck endpoints
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", service: "gateway", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from AgentForge Gateway v3", status: "healthy" });
});

// 4. Block External Access to Privileged Internal Endpoints
app.all(["/api/auth/update-plan", "/api/auth/deduct-credits"], (req, res) => {
  return res.status(403).json({ message: "Forbidden: internal service endpoint cannot be called externally" });
});

// 5. Auth Service Proxy (Public login & internal me)
app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE || "http://localhost:8001", {
    proxyReqOptDecorator: (proxyReqOpts) => {
      delete proxyReqOpts.headers["x-internal-service-key"];
      return proxyReqOpts;
    },
  })
);

// 6. User Current Profile
app.get("/api/me", protect, getCurrentUser);

// 7. Chat Service Proxy (Protected)
app.use(
  "/api/chat",
  protect,
  proxyWithHeader(process.env.CHAT_SERVICE || "http://localhost:8002")
);

// 8. Agent Service Proxy (Protected, with streaming and file upload limits)
app.use(
  "/api/agent",
  protect,
  proxyWithHeader(process.env.AGENT_SERVICE || "http://localhost:8003", {
    limit: "25mb",
    timeout: 300000,
  })
);

// 9. Billing Service Proxy (Protected, checkout creation & verification)
app.use(
  "/api/billing",
  protect,
  proxyWithHeader(process.env.BILLING_SERVICE || "http://localhost:8004")
);

// 10. Global 404 & Error Handlers
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error("Gateway Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal gateway error",
  });
});

app.listen(port, () => {
  console.log(`AgentForge Gateway started at port: ${port}`);
});
