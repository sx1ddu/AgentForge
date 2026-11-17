import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_agentforge";

const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});

export default stripe;
