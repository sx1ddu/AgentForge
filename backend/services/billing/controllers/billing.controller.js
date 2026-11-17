import { PLANS } from "../config/Plans.js";
import stripe from "../config/stripe.js";
import axios from "axios";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user identity" });
    }

    const selectedPlan = PLANS[plan?.toLowerCase()];

    if (!selectedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (selectedPlan.amount === 0) {
      return res.status(400).json({ message: "Free plan does not require checkout" });
    }

    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AgentForge ${selectedPlan.name} Plan`,
              description: `${selectedPlan.credits} credits valid for ${selectedPlan.validity} days`,
            },
            unit_amount: Math.round(selectedPlan.amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        credits: String(selectedPlan.credits),
        plan: selectedPlan.name.toLowerCase(),
      },
      success_url: `${clientUrl}/?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${clientUrl}/?payment=cancelled`,
    });

    await Payment.create({
      userId,
      orderId: session.id,
      paymentId: "",
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.name.toLowerCase(),
      currency: "USD",
      status: "created",
    });

    return res.status(200).json({
      sessionUrl: session.url,
      orderId: session.id,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: `Create order failed: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.headers["x-user-id"];

    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const payment = await Payment.findOne({ orderId: session_id });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Verify ownership if caller is a client
    if (userId && payment.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: Payment does not belong to you" });
    }

    // If Stripe verified paid and our record not yet marked paid, update and credit user
    if (session.payment_status === "paid" && payment.status !== "paid") {
      payment.status = "paid";
      payment.paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;
      await payment.save();

      // Credit user via internal API with secret header
      const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
      await axios.post(
        `${authServiceUrl}/update-plan`,
        {
          userId: payment.userId,
          plan: payment.plan,
          credits: payment.credits,
        },
        {
          headers: {
            "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
          },
        }
      );
    }

    return res.status(200).json({
      status: payment.status,
      credits: payment.credits,
      plan: payment.plan,
      paid: payment.status === "paid",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: `Payment verification failed: ${error.message}` });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not configured. Webhook validation cannot proceed.");
      return res.status(400).send("Webhook secret not configured");
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);
    return res.status(400).send(`Webhook Signature Verification Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Idempotency check: see if already processed
      let payment = await Payment.findOne({ orderId: session.id });

      if (payment && payment.status === "paid") {
        console.log(`Webhook idempotency: Order ${session.id} already credited.`);
        return res.json({ received: true, alreadyProcessed: true });
      }

      const targetUserId = payment?.userId || session.metadata?.userId;
      const targetPlan = payment?.plan || session.metadata?.plan || "starter";
      const targetCredits = Number(payment?.credits || session.metadata?.credits || 500);

      if (payment) {
        payment.status = "paid";
        payment.paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;
        await payment.save();
      } else if (targetUserId) {
        payment = await Payment.create({
          userId: targetUserId,
          orderId: session.id,
          paymentId: typeof session.payment_intent === "string" ? session.payment_intent : session.id,
          amount: (session.amount_total || 0) / 100,
          currency: (session.currency || "usd").toUpperCase(),
          credits: targetCredits,
          plan: targetPlan,
          status: "paid",
        });
      }

      // Automatically credit user account upon webhook completion!
      if (targetUserId) {
        const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
        await axios.post(
          `${authServiceUrl}/update-plan`,
          {
            userId: targetUserId,
            plan: targetPlan,
            credits: targetCredits,
          },
          {
            headers: {
              "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
            },
          }
        );
        console.log(`Successfully credited ${targetCredits} credits to user ${targetUserId}`);
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { status: "failed" }
      );
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: "Webhook event processing failed" });
  }
};
