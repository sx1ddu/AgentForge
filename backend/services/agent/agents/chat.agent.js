import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmmodels.js";
import { getMemory } from "../config/memory.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const chatAgent = async (state) => {
  let creditDeducted = false;
  try {
    await checkAgentLimit(state.userId, "chat");

    // Pre-deduct credits prior to LLM execution
    await deductCredits(state.userId, "chat");
    creditDeducted = true;

    const llm = await getModel("chat");
    const history = await getMemory(state.conversationId);

    // Prepare search context if search agent passed results
    const searchContext =
      state.searchResults?.results
        ?.slice(0, 5)
        .map(
          (r, i) => `
Source [${i + 1}]:
Title: ${r.title}
URL: ${r.url}
Content: ${r.content}
`
        )
        .join("\n\n") || "";

    const systemPrompt = `You are AgentForge, an intelligent, helpful, and highly capable AI assistant.

Core Principles:
1. Accuracy: Base answers on verified facts. Never invent or hallucinate information.
2. Clarity: Provide clear, well-structured answers using markdown.
3. Helpfulness: Be concise for simple questions, detailed for complex inquiries.

${
  searchContext
    ? `Current Grounded Information:
Use the following real-time web search results as primary context:
${searchContext}

Attribute key claims to the numbered sources where appropriate.`
    : ""
}`;

    const messages = [new SystemMessage(systemPrompt)];

    // Add recent conversation history (last 6 messages for context)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    recentHistory.forEach((msg) => {
      if (msg.role === "user" && msg.content) {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant" && msg.content) {
        messages.push(new AIMessage(msg.content));
      }
    });

    // Add current user prompt
    messages.push(new HumanMessage(state.prompt));

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error("Chat Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "chat");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to generate chat response. Your credits have not been deducted.",
    };
  }
};
