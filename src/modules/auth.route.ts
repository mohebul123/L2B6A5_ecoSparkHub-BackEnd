import { Router } from "express";
import { authController } from "./auth.controller";
import auth, { UserRole } from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../schemas/user.schema";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get(
  "/me",
  auth(UserRole.member, UserRole.admin),
  authController.getCurrentUser,
);
export const authRouter = router;
