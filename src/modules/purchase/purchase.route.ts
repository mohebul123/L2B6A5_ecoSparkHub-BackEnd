import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { PurchaseController } from "./purchase.controller";

const router = Router();

// Shudhu login kora user-ra kinte parbe
router.post(
  "/",
  auth(UserRole.member, UserRole.admin),
  PurchaseController.purchaseIdea,
);

// User tar kena list dekhbe
router.get(
  "/my-purchases",
  auth(UserRole.member, UserRole.admin),
  PurchaseController.getMyPurchases,
);

export const PurchaseRoutes = router;
