import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PLANS } from "../services/billing/config/Plans.js";
import { stripeWebhook } from "../services/billing/controllers/billing.controller.js";

describe("Billing & Pricing Consistency Tests", () => {
  it("TASK-08: Currency across all plans is standardized to USD", () => {
    assert.ok(PLANS.free, "Free plan must exist");
    assert.ok(PLANS.starter, "Starter plan must exist");
    assert.ok(PLANS.pro, "Pro plan must exist");

    assert.equal(PLANS.starter.currency, "USD", "Starter currency must be USD");
    assert.equal(PLANS.starter.symbol, "$", "Starter symbol must be $");
    assert.equal(PLANS.starter.amount, 9.99, "Starter price must be $9.99");
    assert.equal(PLANS.starter.credits, 500, "Starter must yield 500 credits");

    assert.equal(PLANS.pro.currency, "USD", "Pro currency must be USD");
    assert.equal(PLANS.pro.symbol, "$", "Pro symbol must be $");
    assert.equal(PLANS.pro.amount, 19.99, "Pro price must be $19.99");
    assert.equal(PLANS.pro.credits, 1500, "Pro must yield 1500 credits");
  });

  it("TASK-06: stripeWebhook rejects calls with invalid or missing signature", async () => {
    let statusCode = null;
    let responseText = null;

    const mockReq = {
      headers: {
        "stripe-signature": "invalid_sig_abc123",
      },
      body: Buffer.from(JSON.stringify({ id: "evt_123" })),
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return {
          send(text) {
            responseText = text;
          },
          json() {},
        };
      },
    };

    await stripeWebhook(mockReq, mockRes);

    assert.equal(statusCode, 400, "Must return HTTP 400 on signature verification failure");
  });
});
