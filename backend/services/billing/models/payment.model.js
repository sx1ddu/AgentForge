import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    credits: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
