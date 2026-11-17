/**
 * Request validation schemas and middleware for AgentForge.
 * Validates payloads, types, lengths, and formats to reject malformed requests early.
 */

export const validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    const errors = schema(dataToValidate);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors,
      });
    }
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Malformed request payload",
      error: err.message,
    });
  }
};

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const validateLogin = (reqData) => {
  const errors = [];
  if (!reqData.body?.token || typeof reqData.body.token !== "string" || reqData.body.token.trim().length === 0) {
    errors.push({ field: "token", message: "Firebase ID token is required and must be a non-empty string" });
  }
  return errors;
};

export const validateUpdatePlan = (reqData) => {
  const errors = [];
  const { userId, plan, credits } = reqData.body || {};
  if (!userId || !isValidObjectId(userId)) {
    errors.push({ field: "userId", message: "Valid 24-character hex userId is required" });
  }
  if (!plan || typeof plan !== "string") {
    errors.push({ field: "plan", message: "Plan name is required" });
  }
  if (typeof credits !== "number" || credits < 0) {
    errors.push({ field: "credits", message: "Credits must be a non-negative number" });
  }
  return errors;
};

export const validateDeductCredits = (reqData) => {
  const errors = [];
  const { userId, agent } = reqData.body || {};
  if (!userId || !isValidObjectId(userId)) {
    errors.push({ field: "userId", message: "Valid 24-character hex userId is required" });
  }
  if (!agent || typeof agent !== "string") {
    errors.push({ field: "agent", message: "Agent name is required" });
  }
  return errors;
};

export const validateUpdateConversation = (reqData) => {
  const errors = [];
  const { id, title } = reqData.body || {};
  if (!id || !isValidObjectId(id)) {
    errors.push({ field: "id", message: "Valid 24-character hex conversation ID is required" });
  }
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "Title must be a non-empty string" });
  } else if (title.length > 200) {
    errors.push({ field: "title", message: "Title cannot exceed 200 characters" });
  }
  return errors;
};

export const validateSaveMessage = (reqData) => {
  const errors = [];
  const { conversationId, role, content } = reqData.body || {};
  if (!conversationId || !isValidObjectId(conversationId)) {
    errors.push({ field: "conversationId", message: "Valid 24-character hex conversationId is required" });
  }
  if (!role || !["user", "assistant"].includes(role)) {
    errors.push({ field: "role", message: "Role must be 'user' or 'assistant'" });
  }
  if (content === undefined || content === null || typeof content !== "string") {
    errors.push({ field: "content", message: "Message content must be a string" });
  }
  return errors;
};

export const validateCreateOrder = (reqData) => {
  const errors = [];
  const { plan } = reqData.body || {};
  const validPlans = ["free", "starter", "pro"];
  if (!plan || !validPlans.includes(plan.toLowerCase())) {
    errors.push({ field: "plan", message: `Plan must be one of: ${validPlans.join(", ")}` });
  }
  return errors;
};

export const validateChatPrompt = (reqData) => {
  const errors = [];
  const { prompt, conversationId } = reqData.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    errors.push({ field: "prompt", message: "Prompt must be a non-empty string" });
  }
  if (!conversationId || !isValidObjectId(conversationId)) {
    errors.push({ field: "conversationId", message: "Valid 24-character hex conversationId is required" });
  }
  return errors;
};
