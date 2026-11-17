import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { getModel } from "../config/llmmodels.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageAnalyzer = async (state) => {
  let creditDeducted = false;
  try {
    await checkAgentLimit(state.userId, "imageAnalyzer");
    await deductCredits(state.userId, "imageAnalyzer");
    creditDeducted = true;

    if (!state.file?.path) {
      throw new Error("No image file was provided for analysis.");
    }

    const llm = await getModel("imageAnalyzer");
    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");

    const messages = [
      new SystemMessage(`You are AgentForge Visual Intelligence Agent.
Rules:
- Analyze the provided image thoroughly and accurately.
- Answer user questions directly.
- Transcribe text, OCR tables, diagram components, or visual data when present.
- Format structured findings cleanly with Markdown.`),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Analyze this image and describe what you observe in detail.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype || "image/png"};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error("Image Analyzer Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "imageAnalyzer");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to analyze the uploaded image.",
    };
  } finally {
    if (state.file?.path) {
      try {
        await fs.unlink(state.file.path);
      } catch (unlinkErr) {
        // file already deleted or moved
      }
    }
  }
};
