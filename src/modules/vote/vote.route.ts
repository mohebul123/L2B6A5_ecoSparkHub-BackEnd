import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { VoteController } from "./vote.controller";

const router = Router();

// Vote dite hole oboshoy login thakte hobe
router.post(
  "/",
  auth(UserRole.member, UserRole.admin),
  VoteController.triggerVote,
);

export const VoteRoutes = router;
