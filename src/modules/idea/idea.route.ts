import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { upload } from "../../config/cloudinary.config";
import { IdeaController } from "./idea.controller";

const router = Router();

// ১. Public Route: Approved ideas shobai dekhte parbe
router.get("/", IdeaController.getAllApprovedIdeas);

// ২. Create Idea: Logged in users (Member/Admin)
router.post(
  "/create-idea",
  auth(UserRole.member, UserRole.admin),
  upload.single("file"),
  IdeaController.createIdea,
);

// ৩. Member's Own Ideas: Sudhu nijer dashboard-er jonno
router.get("/my-ideas", auth(UserRole.member), IdeaController.getMyIdeas);

// ৪. Admin Moderation: Tumi jeta bolle (PATCH status)
router.patch("/status/:id", auth(UserRole.admin), IdeaController.updateStatus);

router.get(
  "/:id",
  auth(UserRole.member, UserRole.admin), // User info pathano dorkar guard logic-er jonno
  IdeaController.getSingleIdea,
);

// Admin shob ideas (Pending/Approved/Rejected) dekhte parbe
router.get(
  "/admin-ideas",
  auth(UserRole.admin),
  IdeaController.getAllIdeasForAdmin,
);

export const IdeaRoutes = router;
