import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { onboard } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

//Check if user is authenticated or not
router.get("/me", protectRoute, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});

export default router;
