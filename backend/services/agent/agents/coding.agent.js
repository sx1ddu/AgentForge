import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmmodels.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { extractJson } from "../utils/cleanJson.js";

export const codingAgent = async (state) => {
  let creditDeducted = false;
  try {
    await checkAgentLimit(state.userId, "coding");

    // Pre-deduct credits before generation
    await deductCredits(state.userId, "coding");
    creditDeducted = true;

    const intentLlm = await getModel("intent");
    const llm = await getModel("coding");

    const intentRes = await intentLlm.invoke(`
You are an intent classifier for software engineering queries.
Return ONLY one of these values:
CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSATION
DOCUMENTATION

User Request:
${state.prompt}
`);

    const intent = typeof intentRes.content === "string" ? intentRes.content.trim() : "CODE_GENERATION";

    if (intent === "CODE_GENERATION" || intent.includes("CODE_GENERATION")) {
      const prompt = `
You are AgentForge, a senior principal software engineer.
Generate complete, modular, production-ready code for the following request.

Rules:
- Generate every required file.
- Provide full, non-truncated file contents.
- Do NOT wrap the JSON inside markdown fences.
- Return ONLY valid JSON starting with { and ending with }.

Schema:
{
  "title": "Project Title",
  "files": [
    {
      "name": "index.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "name": "style.css",
      "content": "/* CSS */..."
    },
    {
      "name": "script.js",
      "content": "// JS..."
    }
  ]
}

User Request:
${state.prompt}
`;

      const res = await llm.invoke(prompt);

      try {
        const data = extractJson(res.content);

        return {
          ...state,
          aiResponse: "Project Code Generated Successfully. View and edit files in the Artifact panel on the right.",
          artifacts: [
            {
              id: Date.now(),
              type: "Project",
              files: Array.isArray(data.files) ? data.files : [],
              title: data.title || state.prompt.slice(0, 50),
            },
          ],
        };
      } catch (err) {
        console.warn("JSON Parse Error on coding generation, returning raw markdown:", err.message);
        return {
          ...state,
          aiResponse: typeof res.content === "string" ? res.content : "Code generated.",
          artifacts: [],
        };
      }
    }

    // Explanations, Reviews, Debugging
    const prompt = `
You are AgentForge, an expert software architect.
Task Type: ${intent}

Provide a structured, insightful response formatted in Markdown:
# Overview
## Explanation / Analysis
## Issues & Solutions
## Best Practices & Patterns
## Implementation Code (if applicable)

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    return {
      ...state,
      aiResponse: typeof res.content === "string" ? res.content : "Code response completed.",
      artifacts: [],
    };
  } catch (error) {
    console.error("Coding Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "coding");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to generate code. Your credits have not been deducted.",
      artifacts: [],
    };
  }
};
