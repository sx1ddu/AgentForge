import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res, next) => {
  try {
    const { prompt, conversationId, agent: selectedAgent } = req.body;
    const file = req.file;
    const userId = req.headers["x-user-id"];

    if (!prompt && !file) {
      return res.status(400).json({ message: "Prompt or file attachment is required" });
    }

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:8002";
    const internalHeaders = {
      "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
      "x-user-id": userId || "",
    };

    // 1. Save user message to persistent database
    await axios.post(
      `${chatServiceUrl}/save-message`,
      {
        conversationId,
        role: "user",
        content: prompt || (file ? `Uploaded file: ${file.originalname}` : ""),
        images: file?.mimetype?.startsWith("image/") ? [file.filename || file.originalname] : [],
      },
      { headers: internalHeaders }
    );

    // 2. Invoke the agent execution graph
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: selectedAgent || "auto",
      userId,
      file,
    });

    const aiResponse = result.aiResponse || "Execution completed.";
    const artifacts = result.artifacts || [];
    const images = result.images || [];

    // 3. Cache conversation in Redis memory
    await addMessage(conversationId, "user", prompt || "");
    await addMessage(conversationId, "assistant", aiResponse);

    // 4. Save assistant response to Chat Service database
    await axios.post(
      `${chatServiceUrl}/save-message`,
      {
        conversationId,
        role: "assistant",
        content: aiResponse,
        images,
        artifacts,
      },
      { headers: internalHeaders }
    );

    return res.status(200).json({
      answer: aiResponse,
      images,
      artifacts,
    });
  } catch (error) {
    console.error("Agent execution error:", error);
    next(error);
  }
};

/**
 * Server-Sent Events (SSE) streaming endpoint for real-time token delivery.
 */
export const streamAgent = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const { prompt, conversationId, agent: selectedAgent } = req.body;
    const userId = req.headers["x-user-id"];

    if (!prompt) {
      sendEvent("error", { message: "Prompt is required" });
      return res.end();
    }

    sendEvent("status", { message: "Initializing agent workflow..." });

    const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:8002";
    const internalHeaders = {
      "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
      "x-user-id": userId || "",
    };

    // Save user message
    await axios.post(
      `${chatServiceUrl}/save-message`,
      {
        conversationId,
        role: "user",
        content: prompt,
      },
      { headers: internalHeaders }
    );

    // Execute graph
    sendEvent("status", { message: "Executing intelligence graph..." });
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: selectedAgent || "auto",
      userId,
    });

    const aiResponse = result.aiResponse || "";
    const artifacts = result.artifacts || [];
    const images = result.images || [];

    // Stream tokens in chunked batches to the client
    const chunkSize = 8;
    for (let i = 0; i < aiResponse.length; i += chunkSize) {
      const chunk = aiResponse.slice(i, i + chunkSize);
      sendEvent("token", { token: chunk });
    }

    // Persist assistant message
    await addMessage(conversationId, "user", prompt);
    await addMessage(conversationId, "assistant", aiResponse);

    await axios.post(
      `${chatServiceUrl}/save-message`,
      {
        conversationId,
        role: "assistant",
        content: aiResponse,
        images,
        artifacts,
      },
      { headers: internalHeaders }
    );

    sendEvent("done", {
      answer: aiResponse,
      images,
      artifacts,
    });

    res.end();
  } catch (error) {
    console.error("Stream agent error:", error);
    sendEvent("error", { message: error.message || "Streaming failed" });
    res.end();
  }
};
