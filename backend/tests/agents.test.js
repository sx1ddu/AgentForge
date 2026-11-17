import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractJson } from "../services/agent/utils/cleanJson.js";
import { getModel } from "../services/agent/config/llmmodels.js";

describe("Agent & LLM Utility Tests", () => {
  it("TASK-11: extractJson correctly parses raw JSON", () => {
    const raw = '{"title":"Test Document","sections":[{"heading":"Intro","points":["Point A"]}]}';
    const parsed = extractJson(raw);
    assert.equal(parsed.title, "Test Document");
    assert.equal(parsed.sections.length, 1);
  });

  it("TASK-11: extractJson cleanly strips markdown code fences ```json", () => {
    const fenced = "```json\n{\n  \"title\": \"Fenced Project\",\n  \"files\": [{\"name\": \"app.js\", \"content\": \"console.log(1);\"}]\n}\n```";
    const parsed = extractJson(fenced);
    assert.equal(parsed.title, "Fenced Project");
    assert.equal(parsed.files.length, 1);
  });

  it("TASK-11: extractJson strips preamble and conversational chatter from models", () => {
    const conversational = 'Here is the requested presentation outline:\n\n```json\n{\n  "title": "Clean Presentation",\n  "slides": []\n}\n```\nHope this helps your presentation!';
    const parsed = extractJson(conversational);
    assert.equal(parsed.title, "Clean Presentation");
    assert.ok(Array.isArray(parsed.slides));
  });

  it("TASK-11: extractJson throws meaningful error on completely malformed input", () => {
    assert.throws(
      () => extractJson("Not a json at all!"),
      /Failed to parse LLM response into valid JSON/
    );
  });

  it("TASK-18: getModel returns valid model instance for all registered agents", async () => {
    const chatModel = await getModel("chat");
    assert.ok(chatModel, "Chat model must be defined");

    const codingModel = await getModel("coding");
    assert.ok(codingModel, "Coding model must be defined");

    const routerModel = await getModel("router");
    assert.ok(routerModel, "Router model must be defined");

    const visionModel = await getModel("imageAnalyzer");
    assert.ok(visionModel, "Vision model must be defined");
  });
});
