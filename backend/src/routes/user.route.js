import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest
} from "../controllers/user.controller.js";

const router = express.Router();

//Apply auth middleware to all routes without adding to each route.
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest); //Put request because we are trying to update some fields

export default router;
