import { getModel } from "../config/llmmodels.js";

export const router = async (state) => {
  // 1. Explicit agent requested by user from UI
  if (state.agent && state.agent !== "auto") {
    const normalized = state.agent.toLowerCase();
    if (["team", "multi-agent", "orchestrator"].includes(normalized)) {
      return {
        ...state,
        agent: "planner",
      };
    }
    return {
      ...state,
      agent: normalized,
    };
  }

  // 2. File attachment automatic routing
  if (state.file) {
    if (state.file.mimetype === "application/pdf") {
      return {
        ...state,
        agent: "pdfRag",
      };
    }

    if (state.file.mimetype.startsWith("image/")) {
      return {
        ...state,
        agent: "imageAnalyzer",
      };
    }
  }

  // 3. LLM Router classification
  try {
    const llm = await getModel("router");
    const prompt = `You are an intelligent agent dispatcher for AgentForge.
Select the single best agent for the user's request.

Available agents:
- chat: general conversation, explanations, answering questions, writing text
- search: current events, weather, stock prices, news, recent factual information
- coding: generate code, fix bugs, design architectures, web development
- pdf: create or format a downloadable PDF document
- ppt: create a PowerPoint presentation
- vision: generate or create an image/drawing
- planner: complex multi-step software engineering projects requiring planning, research, and review

Return ONLY ONE WORD:
chat
search
coding
pdf
ppt
vision
planner

User Query:
${state.prompt}
`;

    const response = await llm.invoke(prompt);
    const chosen = (typeof response.content === "string" ? response.content : "chat")
      .trim()
      .toLowerCase();

    const validAgents = ["chat", "search", "coding", "pdf", "ppt", "vision", "planner"];
    const agent = validAgents.includes(chosen) ? chosen : "chat";

    return {
      ...state,
      agent,
    };
  } catch (err) {
    console.warn("Router classification error, falling back to chat:", err.message);
    return {
      ...state,
      agent: "chat",
    };
  }
};
