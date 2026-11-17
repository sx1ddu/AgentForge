import redis from "../../../shared/redis/redis.js";

const Limits = {
  chat: 30,
  coding: 10,
  pdf: 10,
  ppt: 10,
  image: 10,
  vision: 10,
  search: 15,
  pdfRag: 10,
  imageAnalyzer: 15,
  orchestrator: 10,
};

export const checkAgentLimit = async (userId, agent) => {
  if (!userId) return { remaining: 10, limit: 10 };

  const max = Limits[agent] || Limits["chat"];
  const key = `rate:${userId}:${agent}`;

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60);
    }

    const ttl = await redis.ttl(key);

    if (count > max) {
      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;
      const time = minutes > 0 ? `${minutes}m : ${seconds}s` : `${seconds}s`;

      const error = new Error(`Rate limit exceeded for ${agent}.`);
      error.status = 429;
      error.data = {
        success: false,
        agent,
        limit: max,
        remainingTime: ttl,
        retryAfter: time,
        message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`,
      };

      throw error;
    }

    return {
      remaining: Math.max(0, max - count),
      limit: max,
    };
  } catch (err) {
    if (err.status === 429) throw err;
    console.warn("Rate limit check error (allowing request):", err.message);
    return { remaining: max, limit: max };
  }
};
