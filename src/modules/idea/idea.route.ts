import { Router } from "express";
import { upload } from "../../config/cloudinary.config";

import auth, { UserRole } from "../../middlewares/auth";
import { IdeaController } from "./idea.controller";

const router = Router();

router.post(
  "/create-idea",
  auth(UserRole.member), // User logged in kina check korbe
  upload.single("file"), // Image file dhorbe
  IdeaController.createIdea,
);

export const IdeaRoutes = router;
