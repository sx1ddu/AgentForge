import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";

dotenv.config();

export const vectorStore = async (docs, collectionName) => {
  const qdrantUrl = process.env.QDRANT_URL;

  if (qdrantUrl) {
    try {
      return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: qdrantUrl,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName,
      });
    } catch (err) {
      console.warn("Qdrant connection failed, falling back to in-memory search:", err.message);
    }
  }

  // Fallback: In-memory vector store representation
  return {
    async similaritySearch(query, k = 5) {
      // Basic fallback term-frequency search if vector DB is unavailable
      const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = docs.map((doc) => {
        const text = doc.pageContent.toLowerCase();
        let matches = 0;
        queryWords.forEach((word) => {
          if (text.includes(word)) matches += 1;
        });
        return { doc, score: matches };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, k).map((s) => s.doc);
    },
  };
};

export const deleteQdrantCollection = async (collectionName) => {
  const qdrantUrl = process.env.QDRANT_URL;
  if (!qdrantUrl) return;

  try {
    const response = await fetch(`${qdrantUrl}/collections/${collectionName}`, {
      method: "DELETE",
      headers: process.env.QDRANT_API_KEY
        ? { "api-key": process.env.QDRANT_API_KEY }
        : {},
    });
    if (response.ok) {
      console.log(`Cleaned up ephemeral Qdrant collection: ${collectionName}`);
    }
  } catch (err) {
    console.warn(`Failed to delete Qdrant collection ${collectionName}:`, err.message);
  }
};
