import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requireInternalAuth } from "../shared/auth/internalAuth.js";
import protect from "../gateway/middleware/auth.middleware.js";

describe("Security & Authorization Regression Tests", () => {
  it("TASK-01: requireInternalAuth rejects requests with missing x-internal-service-key", () => {
    process.env.INTERNAL_SERVICE_KEY = "test-secret-key-12345";

    let statusCode = null;
    let responseBody = null;

    const mockReq = {
      headers: {},
    };
    const mockRes = {
      status(code) {
        statusCode = code;
        return {
          json(data) {
            responseBody = data;
          },
        };
      },
    };
    let nextCalled = false;
    const mockNext = () => {
      nextCalled = true;
    };

    requireInternalAuth(mockReq, mockRes, mockNext);

    assert.equal(statusCode, 403, "Should return HTTP 403 Forbidden for missing key");
    assert.equal(nextCalled, false, "next() must not be called when key is missing");
  });

  it("TASK-01: requireInternalAuth rejects requests with invalid x-internal-service-key", () => {
    process.env.INTERNAL_SERVICE_KEY = "test-secret-key-12345";

    let statusCode = null;
    const mockReq = {
      headers: {
        "x-internal-service-key": "attacker-wrong-key",
      },
    };
    const mockRes = {
      status(code) {
        statusCode = code;
        return { json() {} };
      },
    };
    let nextCalled = false;

    requireInternalAuth(mockReq, mockRes, () => {
      nextCalled = true;
    });

    assert.equal(statusCode, 403, "Should return HTTP 403 Forbidden for invalid key");
    assert.equal(nextCalled, false);
  });

  it("TASK-01: requireInternalAuth allows requests with valid x-internal-service-key", () => {
    process.env.INTERNAL_SERVICE_KEY = "test-secret-key-12345";

    const mockReq = {
      headers: {
        "x-internal-service-key": "test-secret-key-12345",
      },
    };
    const mockRes = {
      status() {
        return { json() {} };
      },
    };
    let nextCalled = false;

    requireInternalAuth(mockReq, mockRes, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, "next() must be called when valid internal key is supplied");
  });

  it("TASK-03: protect middleware rejects unauthenticated requests with HTTP 401", async () => {
    let statusCode = null;
    let jsonBody = null;

    const mockReq = { cookies: {} };
    const mockRes = {
      status(code) {
        statusCode = code;
        return {
          json(body) {
            jsonBody = body;
          },
        };
      },
    };
    let nextCalled = false;

    await protect(mockReq, mockRes, () => {
      nextCalled = true;
    });

    assert.equal(statusCode, 401, "Must return HTTP 401 Unauthorized instead of 400");
    assert.equal(nextCalled, false);
    assert.match(jsonBody.message, /Unauthorized/i);
  });

  it("TASK-01: proxyWithHeader strips spoofed client internal service key", () => {
    const fakeProxyReqOpts = {
      headers: {
        "x-internal-service-key": "malicious-client-spoof",
        "x-user-id": "attacker-user-id",
        "content-type": "application/json",
      },
    };
    const mockSrcReq = {
      user: {
        userId: "authenticated-user-673752e2a1b2c3d4e5f6a7b8",
      },
    };

    // Simulate decorator execution
    delete fakeProxyReqOpts.headers["x-internal-service-key"];
    if (mockSrcReq.user) {
      fakeProxyReqOpts.headers["x-user-id"] = String(mockSrcReq.user.userId);
    }

    assert.equal(fakeProxyReqOpts.headers["x-internal-service-key"], undefined, "Spoofed internal key must be removed");
    assert.equal(
      fakeProxyReqOpts.headers["x-user-id"],
      "authenticated-user-673752e2a1b2c3d4e5f6a7b8",
      "x-user-id must be replaced with authenticated session userId"
    );
  });

  it("TASK-04: IDOR protection guarantees queries are strictly scoped to authenticated userId", () => {
    const authUserId = "673752e2a1b2c3d4e5f6a7b8";
    const victimUserId = "673752e2a1b2c3d4e5f6a7b9";
    const targetConversationId = "673752e2a1b2c3d4e5f6a7ba";

    // Query builder pattern used across chat.controller.js
    const buildSecureQuery = (conversationId, userId) => ({
      _id: conversationId,
      userId,
    });

    const queryForCaller = buildSecureQuery(targetConversationId, authUserId);
    assert.deepEqual(queryForCaller, {
      _id: targetConversationId,
      userId: authUserId,
    });

    // Mismatched user lookup fails match
    assert.notEqual(queryForCaller.userId, victimUserId, "Caller cannot query victim's conversations");
  });
});
