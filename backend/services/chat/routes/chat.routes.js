import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  saveMessage,
  updateConversation,
  deleteConversation,
} from "../controllers/chat.controller.js";
import {
  validate,
  validateUpdateConversation,
  validateSaveMessage,
} from "../../../shared/validation/schemas.js";

const router = express.Router();

// Support both POST and GET for conversation creation
router.post("/create-conversation", createConversation);
router.get("/create-conversation", createConversation);

router.get("/get-conversations", getConversations);
router.post("/update-conversation", validate(validateUpdateConversation), updateConversation);
router.post("/save-message", validate(validateSaveMessage), saveMessage);

// Support both plural and singular routes to prevent any endpoint mismatch
router.get("/get-messages/:conversationId", getMessages);
router.get("/get-message/:conversationId", getMessages);

// Delete conversation endpoint
router.delete("/delete-conversation/:id", deleteConversation);
router.post("/delete-conversation", deleteConversation);

export default router;
