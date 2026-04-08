import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { CategoryController } from "./category.controller";

const router = Router();

// Shudhu Admin category create korbe
router.post(
  "/create-category",
  auth(UserRole.admin), // Middleware jeno Admin check kore
  CategoryController.createCategory,
);

// Shobai category list dekhte parbe
router.get("/", CategoryController.getAllCategories);

export const CategoryRoutes = router;
