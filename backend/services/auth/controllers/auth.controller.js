import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import { getFirebaseApp } from "../config/firebase.js";
import redis from "../../../shared/redis/redis.js";

const AGENT_CREDIT_COSTS = {
  chat: 1,
  search: 5,
  coding: 10,
  pdf: 10,
  ppt: 10,
  vision: 10,
  image: 10,
  pdfRag: 10,
  imageAnalyzer: 5,
  orchestrator: 15,
};

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Firebase authentication token is required" });
    }

    const firebaseApp = getFirebaseApp();
    let decoded;

    try {
      decoded = await getAuth(firebaseApp).verifyIdToken(token);
    } catch (authError) {
      console.error("Firebase verifyIdToken error:", authError.message);
      return res.status(401).json({ message: "Invalid or expired Firebase authentication token" });
    }

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.email?.split("@")[0] || "User",
        email: decoded.email || "",
        avatar: decoded.picture || "",
        plan: "free",
        credits: 100,
        totalCredits: 100,
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    const sessionId = crypto.randomUUID();
    const sessionPayload = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      credits: user.credits,
      totalCredits: user.totalCredits,
      planExpiresAt: user.planExpiresAt,
    };

    // Store both session-to-user and user-to-session mappings in Redis
    await redis.set(`session-${sessionId}`, JSON.stringify(sessionPayload), "EX", 7 * 24 * 60 * 60);
    await redis.set(`user-session-${user._id}`, sessionId, "EX", 7 * 24 * 60 * 60);

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({ message: "An error occurred during authentication" });
  }
};

export const logout = async (req, res) => {
  try {
    // FIX: Express cookie-parser populates req.cookies, not req.cookie
    const sessionId = req.cookies?.session;

    if (sessionId) {
      const session = await redis.get(`session-${sessionId}`);
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed?.userId) {
            await redis.del(`user-session-${parsed.userId}`);
          }
        } catch (e) {
          // ignore parse error on logout
        }
      }
      await redis.del(`session-${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout controller error:", error);
    return res.status(500).json({ message: "An error occurred during logout" });
  }
};

export const me = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Me controller error:", error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;

    if (!userId || !credits) {
      return res.status(400).json({ message: "userId and credits are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan || user.plan;
    user.credits = (user.credits || 0) + Number(credits);
    user.totalCredits = (user.totalCredits || 0) + Number(credits);
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    // Update active Redis session if user is logged in
    const sessionId = await redis.get(`user-session-${user._id}`);
    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id.toString(),
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
    }

    return res.status(200).json({
      success: true,
      credits: user.credits,
      totalCredits: user.totalCredits,
      plan: user.plan,
    });
  } catch (error) {
    console.error("Update user payment error:", error);
    return res.status(500).json({ message: "Failed to update user payment details" });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const requiredCredits = AGENT_CREDIT_COSTS[agent] || 1;

    // ATOMIC deduction: prevents race conditions and overspending
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        credits: { $gte: requiredCredits },
      },
      {
        $inc: { credits: -requiredCredits },
      },
      { new: true }
    );

    if (!user) {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. This action requires ${requiredCredits} credits, but you only have ${existingUser.credits}.`,
        currentCredits: existingUser.credits,
        requiredCredits,
      });
    }

    // Refresh Redis session cache with updated balance
    const sessionId = await redis.get(`user-session-${user._id}`);
    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id.toString(),
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
    }

    return res.status(200).json({
      success: true,
      remainingCredits: user.credits,
      deducted: requiredCredits,
    });
  } catch (error) {
    console.error("Deduct credits error:", error);
    return res.status(500).json({ message: "Credit deduction operation failed" });
  }
};
