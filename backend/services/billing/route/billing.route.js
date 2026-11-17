import express from "express";
import { createOrder, verifyPayment, stripeWebhook } from "../controllers/billing.controller.js";
import { validate, validateCreateOrder } from "../../../shared/validation/schemas.js";

const router = express.Router();

router.post("/create-order", validate(validateCreateOrder), createOrder);
router.get("/verify-payment", verifyPayment);
router.post("/webhook", stripeWebhook);

export default router;
