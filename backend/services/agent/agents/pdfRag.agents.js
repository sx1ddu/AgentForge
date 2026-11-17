import fs from "fs";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore, deleteQdrantCollection } from "../config/vectorDB.js";
import { getModel } from "../config/llmmodels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

// Helper for safe PDF parsing
const parsePdfBuffer = async (buffer) => {
  try {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default || pdfParseModule.PDFParse || pdfParseModule;

    if (typeof pdfParse === "function") {
      const data = await pdfParse(buffer);
      return data.text || "";
    } else if (pdfParse?.PDFParse) {
      const instance = new pdfParse.PDFParse({ data: buffer });
      const res = await instance.getText();
      return res.text || "";
    }
  } catch (err) {
    console.warn("Standard pdf-parse failed, attempting fallback text extraction:", err.message);
  }

  // Fallback: extract ASCII printable strings from buffer
  const rawText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  return rawText.slice(0, 50000);
};

export const pdfRag = async (state) => {
  let creditDeducted = false;
  let collectionName = null;

  try {
    await checkAgentLimit(state.userId, "pdf");
    await deductCredits(state.userId, "pdf");
    creditDeducted = true;

    if (!state.file?.path) {
      throw new Error("No PDF document was attached for analysis.");
    }

    const buffer = fs.readFileSync(state.file.path);
    const text = await parsePdfBuffer(buffer);

    if (!text || text.trim().length === 0) {
      return {
        ...state,
        aiResponse: "The uploaded PDF appears to be empty or contains scanned images without extractable text.",
      };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);

    collectionName = `pdf-${state.userId || "anon"}-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt, 4);
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n---\n\n");

    const llm = await getModel("pdf-rag");

    const messages = [
      new SystemMessage(`You are AgentForge PDF Document Intelligence Assistant.
Rules:
- Answer ONLY from the provided PDF context.
- Never invent facts not supported by the document.
- If the document does not contain the answer, state clearly: "I couldn't find this information in the uploaded PDF."
- Format your response with clear Markdown headings and bullet points.`),
      new HumanMessage(`
Context from Uploaded Document:
${context}

User Question:
${state.prompt}
`),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error("PDF RAG Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "pdf");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || error.message || "Failed to analyze document context.",
    };
  } finally {
    // 1. Cleanup temporary file
    if (state.file?.path) {
      try {
        fs.unlinkSync(state.file.path);
      } catch (err) {
        // ignore already unlinked
      }
    }
    // 2. Cleanup ephemeral Qdrant collection to prevent vector storage leaks
    if (collectionName) {
      deleteQdrantCollection(collectionName).catch(() => {});
    }
  }
};
