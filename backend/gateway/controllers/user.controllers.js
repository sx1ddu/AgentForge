import redis from "../../shared/redis/redis.js";

export const getCurrentUser = async (req, res) => {
  try {
    const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
    const response = await fetch(`${authServiceUrl}/me?userId=${req.user.userId}`, {
      headers: {
        "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
      },
    });

    const user = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(user);
    }

    const sessionId = req.cookies?.session;
    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        7 * 24 * 60 * 60
      );
      await redis.set(`user-session-${user._id}`, sessionId, "EX", 7 * 24 * 60 * 60);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Failed to retrieve current user profile" });
  }
};
