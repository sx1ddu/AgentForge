import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      index: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro"],
      default: "free",
    },
    credits: {
      type: Number,
      default: 100,
      min: 0,
    },
    totalCredits: {
      type: Number,
      default: 100,
      min: 0,
    },
    planExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
