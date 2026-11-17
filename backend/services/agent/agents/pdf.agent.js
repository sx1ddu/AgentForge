import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmmodels.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { extractJson } from "../utils/cleanJson.js";

export const pdfAgent = async (state) => {
  let creditDeducted = false;
  try {
    // 1. Rate limiting check
    await checkAgentLimit(state.userId, "pdf");

    // 2. Pre-deduct credits before expensive LLM and PDF generation
    await deductCredits(state.userId, "pdf");
    creditDeducted = true;

    const llm = await getModel("pdf");
    const prompt = `
You are an expert document writer.
Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.

Structure:
{
  "title": "Document Title",
  "subtitle": "Document Subtitle",
  "sections": [
    {
      "heading": "Section Heading",
      "points": [
        "Concise bullet point 1",
        "Concise bullet point 2"
      ]
    }
  ]
}

Generate 4-8 comprehensive sections.
Each section must have 3-6 concise bullet points.

Topic:
${state.prompt}
`;

    const res = await llm.invoke(prompt);
    const data = extractJson(res.content);

    const pdfBuffer = await generatePdf(data);
    const filename = `pdf-${Date.now()}-${Math.floor(Math.random() * 10000)}.pdf`;

    await uploadToS3(filename, pdfBuffer, "application/pdf");
    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# 📄 PDF Document Generated

**${data.title || "Document"}**

📥 [Download Generated PDF](${downloadUrl})

*Secure download link is active for 24 hours.*`,
    };
  } catch (error) {
    console.error("PDF Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "pdf");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to generate PDF document. Your credits have not been deducted.",
    };
  }
};
