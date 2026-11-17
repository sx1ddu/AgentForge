import express from "express";
import { agent, streamAgent } from "../controllers/agent.controller.js";
import multer from "../config/multer.js";

export const router = express.Router();

router.post("/chat", multer.single("file"), agent);
router.post("/stream", streamAgent);

export default router;
