import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmmodels.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { extractJson } from "../utils/cleanJson.js";

export const pptAgent = async (state) => {
  let creditDeducted = false;
  try {
    // 1. Rate limiting check
    await checkAgentLimit(state.userId, "ppt");

    // 2. Pre-deduct credits before expensive LLM and PPT generation
    await deductCredits(state.userId, "ppt");
    creditDeducted = true;

    const llm = await getModel("ppt");
    const prompt = `
You are a professional presentation designer.
Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.

Format:
{
  "title": "Presentation Title",
  "subtitle": "Presentation Subtitle",
  "slides": [
    {
      "title": "Slide Title",
      "points": [
        "Key insight 1",
        "Key insight 2",
        "Key insight 3",
        "Key insight 4"
      ]
    }
  ]
}

Rules:
- Generate exactly 5 to 7 content slides.
- Each slide must have 3-5 concise bullet points.
- Return ONLY the JSON object.

Topic:
${state.prompt}
`;

    const res = await llm.invoke(prompt);
    const data = extractJson(res.content);

    const ppt = await generatePpt(data);
    const buffer = await ppt.write({ outputType: "nodebuffer" });

    const filename = `ppt-${Date.now()}-${Math.floor(Math.random() * 10000)}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# 📊 Presentation Generated

**${data.title || "Presentation"}**

📥 [Download PowerPoint Presentation (.pptx)](${downloadUrl})

*Secure download link is active for 24 hours.*`,
    };
  } catch (error) {
    console.error("PPT Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "ppt");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to generate presentation. Your credits have not been deducted.",
    };
  }
};
