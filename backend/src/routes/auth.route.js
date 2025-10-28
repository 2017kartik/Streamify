import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { onboard } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

export default router;
