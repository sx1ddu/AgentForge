import { checkAgentLimit } from "../config/agentLimit.js";
import { searchTool } from "../config/tavily.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";

export const searchAgent = async (state) => {
  let creditDeducted = false;
  try {
    await checkAgentLimit(state.userId, "search");
    await deductCredits(state.userId, "search");
    creditDeducted = true;

    let results = { results: [], images: [] };

    if (process.env.TAVILY_API_KEY) {
      try {
        results = await searchTool.invoke({
          query: state.prompt,
        });
      } catch (tavilyErr) {
        console.warn("Tavily search invocation failed:", tavilyErr.message);
      }
    } else {
      console.warn("TAVILY_API_KEY not configured. Passing through to chat agent.");
    }

    return {
      ...state,
      searchResults: results,
      images: results.images || [],
    };
  } catch (error) {
    console.error("Search Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "search");
    }

    return {
      ...state,
      searchResults: { results: [], images: [] },
      images: [],
      aiResponse: error?.data?.message || error.message || "Failed to complete web search.",
    };
  }
};
