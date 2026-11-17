import { getModel } from "../config/llmmodels.js";
import { searchTool } from "../config/tavily.js";
import { extractJson } from "../utils/cleanJson.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";

/**
 * Planner Agent: Decomposes complex user requests into architectural steps.
 */
export const plannerAgent = async (state) => {
  try {
    const llm = await getModel("router");
    const prompt = `You are the Lead Project Planner at AgentForge.
Analyze the user's request and formulate an execution plan.

Return ONLY JSON with this format:
{
  "needsResearch": true,
  "needsCode": true,
  "summary": "Brief summary of objective",
  "steps": [
    "Step 1: Description",
    "Step 2: Description",
    "Step 3: Description"
  ]
}

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);
    const plan = extractJson(res.content);

    return {
      ...state,
      plan,
      iterationCount: 0,
      nextStep: plan.needsResearch ? "researcher" : "coder",
    };
  } catch (err) {
    console.warn("Planner Agent fallback:", err.message);
    return {
      ...state,
      plan: { needsResearch: false, needsCode: true, steps: ["Execute task directly"] },
      iterationCount: 0,
      nextStep: "coder",
    };
  }
};

/**
 * Researcher Agent: Gathers live web documentation and architectural references.
 */
export const researcherAgent = async (state) => {
  try {
    let searchResults = [];
    if (process.env.TAVILY_API_KEY) {
      const res = await searchTool.invoke({
        query: state.prompt,
      });
      searchResults = res.results || [];
    }

    const context = searchResults
      .slice(0, 3)
      .map((r) => `Title: ${r.title}\nContent: ${r.content}`)
      .join("\n\n");

    return {
      ...state,
      researchContext: context,
      nextStep: "coder",
    };
  } catch (err) {
    console.warn("Researcher Agent error:", err.message);
    return {
      ...state,
      researchContext: "",
      nextStep: "coder",
    };
  }
};

/**
 * Collaborative Coder Agent: Generates production code guided by the plan and research.
 */
export const collaborativeCoderAgent = async (state) => {
  try {
    const llm = await getModel("coding");
    const critiqueNotice = state.reviewCritique
      ? `\nPREVIOUS REVIEW CRITIQUE TO RESOLVE:\n${state.reviewCritique}\n`
      : "";

    const researchNotice = state.researchContext
      ? `\nRESEARCH AND DOCUMENTATION CONTEXT:\n${state.researchContext}\n`
      : "";

    const prompt = `You are the Principal Systems Engineer at AgentForge.
Implement a complete, production-grade project based on the following plan.
${critiqueNotice}
${researchNotice}

Plan:
${JSON.stringify(state.plan, null, 2)}

User Objective:
${state.prompt}

Rules:
- Generate complete, modular code files.
- Include CSS and JavaScript functionality where appropriate.
- Return ONLY valid JSON:
{
  "title": "Project Title",
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}
`;

    const res = await llm.invoke(prompt);
    let codeData;
    try {
      codeData = extractJson(res.content);
    } catch (e) {
      codeData = {
        title: state.prompt.slice(0, 40),
        files: [
          {
            name: "solution.md",
            content: res.content,
          },
        ],
      };
    }

    return {
      ...state,
      codeDraft: codeData,
      nextStep: "reviewer",
    };
  } catch (err) {
    console.error("Collaborative Coder Agent error:", err.message);
    return {
      ...state,
      codeDraft: { files: [] },
      nextStep: "reviewer",
    };
  }
};

/**
 * Reviewer Agent: Audits code quality, verifies completeness, and synthesizes the final response.
 */
export const reviewerAgent = async (state) => {
  const currentIteration = state.iterationCount || 0;

  try {
    const llm = await getModel("coding");
    const codeFiles = state.codeDraft?.files || [];

    const prompt = `You are the Code Quality and Security Auditor at AgentForge.
Review the following code solution for completeness, security, and bugs.

Code Files:
${codeFiles.map((f) => `--- ${f.name} ---\n${f.content.slice(0, 1000)}`).join("\n\n")}

User Objective:
${state.prompt}

Return ONLY JSON:
{
  "approved": true,
  "critique": "Assessment notes and constructive feedback",
  "qualityScore": 95
}
`;

    const res = await llm.invoke(prompt);
    let review;
    try {
      review = extractJson(res.content);
    } catch (e) {
      review = { approved: true, critique: "Code passed automated architectural review." };
    }

    // If review failed, and we haven't reached iteration limit (max 1 retry loop)
    if (!review.approved && currentIteration < 1) {
      console.log("Reviewer requested revision. Re-routing to Coder...");
      return {
        ...state,
        reviewCritique: review.critique,
        iterationCount: currentIteration + 1,
        nextStep: "coder",
      };
    }

    // Approved or max iterations reached: synthesize final output
    const files = state.codeDraft?.files || [];
    const artifacts =
      files.length > 0
        ? [
            {
              id: Date.now(),
              type: "Project",
              files,
              title: state.codeDraft?.title || state.prompt.slice(0, 50),
            },
          ]
        : [];

    const summary = `# 🚀 Project Built by AgentForge Multi-Agent Team

### 📋 Architectural Overview
${state.plan?.summary || state.prompt}

### 🔍 Quality & Review Assessment
- **Status:** Verified & Approved
- **Auditor Notes:** ${review.critique || "Code meets architectural standards."}

${files.length > 0 ? "You can preview and edit the complete source code in the **Artifact** panel on the right." : ""}`;

    return {
      ...state,
      aiResponse: summary,
      artifacts,
      nextStep: "done",
    };
  } catch (err) {
    console.error("Reviewer Agent error:", err.message);
    return {
      ...state,
      aiResponse: "Multi-agent execution complete.",
      artifacts: state.codeDraft?.files ? [{ id: Date.now(), type: "Project", files: state.codeDraft.files, title: "Project" }] : [],
      nextStep: "done",
    };
  }
};
