import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

export const embeddings = apiKey
  ? new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "gemini-embedding-001",
    })
  : {
      async embedDocuments(documents) {
        return documents.map(() => new Array(768).fill(0));
      },
      async embedQuery() {
        return new Array(768).fill(0);
      },
    };
