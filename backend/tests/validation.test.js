import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateLogin,
  validateUpdatePlan,
  validateDeductCredits,
  validateUpdateConversation,
  validateSaveMessage,
  validateCreateOrder,
  validateChatPrompt,
} from "../shared/validation/schemas.js";

describe("Input Validation Schema Tests", () => {
  it("validateLogin rejects empty or missing token", () => {
    const errors1 = validateLogin({ body: {} });
    assert.ok(errors1.length > 0, "Missing token should yield validation error");

    const errors2 = validateLogin({ body: { token: "   " } });
    assert.ok(errors2.length > 0, "Whitespace token should yield validation error");

    const valid = validateLogin({ body: { token: "valid-firebase-jwt-string" } });
    assert.equal(valid.length, 0, "Valid token should have 0 errors");
  });

  it("validateUpdatePlan enforces valid ObjectId and positive credits", () => {
    const invalid = validateUpdatePlan({
      body: { userId: "invalid-id", plan: "pro", credits: -50 },
    });
    assert.ok(invalid.length >= 2, "Invalid ID and negative credits must fail");

    const valid = validateUpdatePlan({
      body: { userId: "507f1f77bcf86cd799439011", plan: "pro", credits: 500 },
    });
    assert.equal(valid.length, 0, "Valid plan update payload must pass");
  });

  it("validateDeductCredits validates 24-hex userId and agent name", () => {
    const invalid = validateDeductCredits({ body: { userId: "short", agent: "" } });
    assert.ok(invalid.length >= 2);

    const valid = validateDeductCredits({
      body: { userId: "507f1f77bcf86cd799439011", agent: "coding" },
    });
    assert.equal(valid.length, 0);
  });

  it("validateUpdateConversation checks title length and id", () => {
    const invalid = validateUpdateConversation({
      body: { id: "123", title: "a".repeat(250) },
    });
    assert.ok(invalid.length >= 2, "Invalid ID and oversized title must fail");

    const valid = validateUpdateConversation({
      body: { id: "507f1f77bcf86cd799439011", title: "Refactored Architecture" },
    });
    assert.equal(valid.length, 0);
  });

  it("validateCreateOrder permits only supported plans", () => {
    const invalid = validateCreateOrder({ body: { plan: "enterprise-unlimited" } });
    assert.ok(invalid.length > 0);

    const valid = validateCreateOrder({ body: { plan: "starter" } });
    assert.equal(valid.length, 0);
  });

  it("validateChatPrompt ensures non-empty prompt and valid conversationId", () => {
    const invalid = validateChatPrompt({
      body: { prompt: "", conversationId: "bad-id" },
    });
    assert.ok(invalid.length >= 2);

    const valid = validateChatPrompt({
      body: { prompt: "Build an API", conversationId: "507f1f77bcf86cd799439011" },
    });
    assert.equal(valid.length, 0);
  });
});
