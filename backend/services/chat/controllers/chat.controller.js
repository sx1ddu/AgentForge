import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user identity" });
    }

    const title = req.body?.title || req.query?.title || "New Chat";

    const conversation = await Conversation.create({
      userId,
      title: title.slice(0, 200),
    });

    return res.status(201).json(conversation);
  } catch (error) {
    console.error("Create conversation error:", error);
    return res.status(500).json({ message: "Failed to create conversation" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user identity" });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(100);

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id, title } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user identity" });
    }

    if (!id || !title) {
      return res.status(400).json({ message: "Conversation id and title are required" });
    }

    // IDOR protection: only update if conversation belongs to the authenticated user
    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId },
      { title: title.trim().slice(0, 200), updatedAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or access denied" });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    return res.status(500).json({ message: "Failed to update conversation" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const id = req.params.id || req.body?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user identity" });
    }

    // IDOR protection: only delete if conversation belongs to the authenticated user
    const conversation = await Conversation.findOneAndDelete({ _id: id, userId });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or access denied" });
    }

    // Delete all messages associated with the conversation
    await Message.deleteMany({ conversationId: id });

    return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({ message: "Failed to delete conversation" });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const internalKey = req.headers["x-internal-service-key"];
    const isInternal = internalKey && internalKey === process.env.INTERNAL_SERVICE_KEY;

    const { conversationId, role, content, images, artifacts } = req.body;

    if (!conversationId || !role) {
      return res.status(400).json({ message: "conversationId and role are required" });
    }

    // IDOR protection: verify ownership if not an internal service call
    if (!isInternal && userId) {
      const conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(403).json({ message: "Forbidden: Conversation does not belong to user" });
      }
    }

    const message = await Message.create({
      conversationId,
      content: content || "",
      role,
      images: Array.isArray(images) ? images : [],
      artifacts: Array.isArray(artifacts) ? artifacts : [],
    });

    // Touch conversation updatedAt so recents list updates
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Save message error:", error);
    return res.status(500).json({ message: "Failed to save message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const internalKey = req.headers["x-internal-service-key"];
    const isInternal = internalKey && internalKey === process.env.INTERNAL_SERVICE_KEY;
    const conversationId = req.params.conversationId;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId parameter is required" });
    }

    // IDOR protection: verify conversation belongs to user if not internal call
    if (!isInternal) {
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Missing user identity" });
      }
      const conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found or access denied" });
      }
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: "Failed to retrieve messages" });
  }
};
