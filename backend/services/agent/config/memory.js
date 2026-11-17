import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
  if (!conversationId) return [];

  const key = `messages-${conversationId}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const messages = await getMessages(conversationId);
    if (messages && messages.length > 0) {
      await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
    }

    return messages;
  } catch (err) {
    console.error("Memory retrieval error:", err.message);
    return [];
  }
};

export const addMessage = async (conversationId, role, content) => {
  if (!conversationId || !role || !content) return;

  const key = `messages-${conversationId}`;
  try {
    const rawMessages = await redis.get(key);
    const messages = rawMessages ? JSON.parse(rawMessages) : [];

    messages.push({
      role,
      content,
    });

    if (messages.length > 20) {
      messages.shift();
    }

    // Preserve 24h TTL on every update
    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  } catch (err) {
    console.error("Memory addMessage error:", err.message);
  }
};
