import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { uploadToS3 } from "../services/agent/utils/uploadToS3.js";
import { getFromS3 } from "../services/agent/utils/getFromS3.js";
import { vectorStore } from "../services/agent/config/vectorDB.js";
import { refundCredits } from "../services/agent/utils/deductCredits.js";

describe("Integration Unit Tests & Fallback Resilience", () => {
  it("TASK-12: uploadToS3 and getFromS3 fall back to in-memory store and data URL when S3 unconfigured", async () => {
    // Ensure AWS bucket is unset for fallback test
    const oldBucket = process.env.AWS_BUCKET_NAME;
    delete process.env.AWS_BUCKET_NAME;

    try {
      const filename = `test-doc-${Date.now()}.txt`;
      const content = Buffer.from("AgentForge In-Memory S3 Fallback Payload", "utf-8");

      const savedName = await uploadToS3(filename, content, "text/plain");
      assert.equal(savedName, filename);

      const url = await getFromS3(filename);
      assert.ok(url.startsWith("data:text/plain;base64,"), "Should return base64 data URI");
      assert.ok(url.includes(content.toString("base64")), "Data URI must contain encoded content");
    } finally {
      process.env.AWS_BUCKET_NAME = oldBucket;
    }
  });

  it("TASK-17: vectorStore provides term-similarity fallback search when Qdrant is unconfigured", async () => {
    const oldUrl = process.env.QDRANT_URL;
    delete process.env.QDRANT_URL;

    try {
      const sampleDocs = [
        { pageContent: "AgentForge uses LangGraph for multi-agent workflows", metadata: { id: 1 } },
        { pageContent: "Quantum physics deals with atoms and subatomic particles", metadata: { id: 2 } },
        { pageContent: "AgentForge has real-time token streaming and credit management", metadata: { id: 3 } },
      ];

      const store = await vectorStore(sampleDocs, "test-collection");
      assert.ok(store, "Store instance must be returned");

      const results = await store.similaritySearch("AgentForge multi-agent", 2);
      assert.equal(results.length, 2);
      assert.match(results[0].pageContent, /AgentForge/i);
    } finally {
      process.env.QDRANT_URL = oldUrl;
    }
  });

  it("TASK-02: refundCredits safely handles service-down gracefully without unhandled crashes", async () => {
    // When auth service is unreachable, refundCredits must log and not throw an uncaught exception
    await assert.doesNotReject(async () => {
      await refundCredits("673752e2a1b2c3d4e5f6a7b8", 5, "chat");
    });
  });
});
