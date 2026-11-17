import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

// Helper to get or lazily initialize models
let groqModelInstance = null;
let geminiModelInstance = null;
let openRouterModelInstance = null;

export const getGroqModel = (modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile", temperature = 0.2) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not set. Groq calls may fail.");
  }
  return new ChatGroq({
    apiKey: apiKey || "dummy-groq-key",
    model: modelName,
    temperature,
    maxRetries: 2,
  });
};

export const getGeminiModel = (modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash", temperature = 0.2) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini calls may fail.");
  }
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey || "dummy-gemini-key",
    model: modelName,
    temperature,
    maxRetries: 2,
  });
};

export const getOpenRouterModel = (modelName = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat", temperature = 0.2) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  return new ChatOpenRouter({
    apiKey: apiKey || "dummy-openrouter-key",
    model: modelName,
    temperature,
    maxTokens: 3000,
    maxRetries: 2,
  });
};

export const getModel = async (agent) => {
  // Provider preference hierarchy:
  // 1. If OpenRouter is explicitly chosen or configured as PRIMARY_LLM_PROVIDER
  if (process.env.PRIMARY_LLM_PROVIDER === "openrouter" && process.env.OPENROUTER_API_KEY) {
    return getOpenRouterModel();
  }

  // 2. Specialized agent mappings
  switch (agent) {
    case "imageAnalyzer":
      return getGeminiModel(process.env.GEMINI_VISION_MODEL || "gemini-1.5-flash");

    case "coding":
      // If OpenRouter is available, DeepSeek is top-tier for coding; otherwise Groq / Gemini
      if (process.env.OPENROUTER_API_KEY) {
        return getOpenRouterModel("deepseek/deepseek-chat", 0.1);
      }
      if (process.env.GROQ_API_KEY) {
        return getGroqModel(process.env.GROQ_CODING_MODEL || "llama-3.3-70b-versatile", 0.1);
      }
      return getGeminiModel("gemini-1.5-flash", 0.1);

    case "router":
    case "intent":
      // Fast, low-temperature classification
      if (process.env.GROQ_API_KEY) {
        return getGroqModel("llama-3.1-8b-instant", 0.0);
      }
      return getGeminiModel("gemini-1.5-flash", 0.0);

    case "pdf":
    case "ppt":
      if (process.env.GROQ_API_KEY) {
        return getGroqModel("llama-3.3-70b-versatile", 0.2);
      }
      return getGeminiModel("gemini-1.5-flash", 0.2);

    case "pdf-rag":
    case "pdfRag":
      if (process.env.GEMINI_API_KEY) {
        return getGeminiModel("gemini-1.5-flash", 0.2);
      }
      return getGroqModel("llama-3.3-70b-versatile", 0.2);

    case "chat":
    case "search":
    default:
      if (process.env.GROQ_API_KEY) {
        return getGroqModel(process.env.GROQ_MODEL || "llama-3.3-70b-versatile", 0.3);
      }
      if (process.env.GEMINI_API_KEY) {
        return getGeminiModel("gemini-1.5-flash", 0.3);
      }
      if (process.env.OPENROUTER_API_KEY) {
        return getOpenRouterModel();
      }
      return getGroqModel("llama-3.3-70b-versatile", 0.3);
  }
};
