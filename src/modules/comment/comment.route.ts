import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router = Router();

// Comment korte hole login thakte hobe
router.post(
  "/",
  auth(UserRole.member, UserRole.admin),
  CommentController.createComment,
);

// Idea-r comment dekhte login lagbe na
router.get("/:ideaId", CommentController.getCommentsByIdea);

export const CommentRoutes = router;
