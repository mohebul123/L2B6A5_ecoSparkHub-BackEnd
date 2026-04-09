import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { UserController } from "./user.controller";

const router = Router();

// Route: /api/v1/users/my-stats
router.get(
  "/my-stats",
  auth(UserRole.admin, UserRole.member), // Ensure koro enum name Role.MEMBER kina
  UserController.getMyStats,
);

export const UserRoutes = router;
