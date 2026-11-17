import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation(),
  aiResponse: Annotation(),
  agent: Annotation(),
  conversationId: Annotation(),
  userId: Annotation(),
  file: Annotation(),
  searchResults: Annotation(),
  images: Annotation(),
  artifacts: Annotation(),
  // Multi-agent orchestration states
  plan: Annotation(),
  researchContext: Annotation(),
  codeDraft: Annotation(),
  reviewCritique: Annotation(),
  iterationCount: Annotation(),
  nextStep: Annotation(),
});
