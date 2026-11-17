import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRag } from "../agents/pdfRag.agents.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";
import {
  plannerAgent,
  researcherAgent,
  collaborativeCoderAgent,
  reviewerAgent,
} from "../agents/orchestration.agents.js";

const workflow = new StateGraph(agentState);

// 1. Add all specialized & collaborative agent nodes
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("vision", visionAgent);
workflow.addNode("pdfRag", pdfRag);
workflow.addNode("imageAnalyzer", imageAnalyzer);

// Multi-agent collaborative team nodes
workflow.addNode("planner", plannerAgent);
workflow.addNode("researcher", researcherAgent);
workflow.addNode("collaborativeCoder", collaborativeCoderAgent);
workflow.addNode("reviewer", reviewerAgent);

// 2. Start at router
workflow.addEdge("__start__", "router");

// 3. Conditional routing from router
workflow.addConditionalEdges("router", (state) => {
  switch (state.agent) {
    case "chat":
      return "chat";
    case "search":
      return "search";
    case "coding":
      return "coding";
    case "pdf":
      return "pdf";
    case "ppt":
      return "ppt";
    case "vision":
    case "image":
      return "vision";
    case "pdfRag":
      return "pdfRag";
    case "imageAnalyzer":
      return "imageAnalyzer";
    case "planner":
    case "orchestrator":
    case "team":
      return "planner";
    default:
      return "chat";
  }
}, {
  chat: "chat",
  search: "search",
  coding: "coding",
  pdf: "pdf",
  ppt: "ppt",
  vision: "vision",
  pdfRag: "pdfRag",
  imageAnalyzer: "imageAnalyzer",
  planner: "planner",
});

// 4. Single-turn workflows
workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("vision", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imageAnalyzer", "__end__");

// 5. Collaborative Multi-Agent Loop
// Planner -> Researcher (if needed) or Coder
workflow.addConditionalEdges("planner", (state) => {
  if (state.nextStep === "researcher") {
    return "researcher";
  }
  return "collaborativeCoder";
}, {
  researcher: "researcher",
  collaborativeCoder: "collaborativeCoder",
});

workflow.addEdge("researcher", "collaborativeCoder");
workflow.addEdge("collaborativeCoder", "reviewer");

// Reviewer -> Coder (if revisions needed) or __end__ (if approved)
workflow.addConditionalEdges("reviewer", (state) => {
  if (state.nextStep === "coder") {
    return "collaborativeCoder";
  }
  return "__end__";
}, {
  collaborativeCoder: "collaborativeCoder",
  __end__: "__end__",
});

export const graph = workflow.compile();
