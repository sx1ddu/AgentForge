import express from "express";
import { login, logout, updateUserPayment, me, deductCredits } from "../controllers/auth.controller.js";
import { requireInternalAuth } from "../../../shared/auth/internalAuth.js";
import { validate, validateLogin, validateUpdatePlan, validateDeductCredits } from "../../../shared/validation/schemas.js";

const router = express.Router();

router.post("/login", validate(validateLogin), login);
router.get("/logout", logout);
router.post("/logout", logout); // Support both GET and POST for logout
router.get("/me", me);

// Privileged service-to-service endpoints - require INTERNAL_SERVICE_KEY
router.post("/update-plan", requireInternalAuth, validate(validateUpdatePlan), updateUserPayment);
router.post("/deduct-credits", requireInternalAuth, validate(validateDeductCredits), deductCredits);

export default router;
