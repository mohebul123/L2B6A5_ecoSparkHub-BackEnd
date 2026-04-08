import { Router } from "express";
import { upload } from "../../config/cloudinary.config";
import auth, { UserRole } from "../../middlewares/auth";
import { IdeaController } from "./idea.controller";

const router = Router();

router.post(
  "/create-idea",
  auth(UserRole.member, UserRole.admin), // Authentication & Role Check
  upload.single("file"), // Postman-e key-r nam hobe 'file'
  IdeaController.createIdea,
);

export const IdeaRoutes = router;

//amdin credential
// email: adminmoheb@gmail.com
// password: pass1234

// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzNDc5MGE1LWI3ODMtNGJhZi1iMThkLWQwZjM1ZDVmYzQ3ZiIsIm5hbWUiOiJhZG1pbk1vaGViIiwiZW1haWwiOiJhZG1pbm1vaGViQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NTY2NDIwMiwiZXhwIjoxNzc2MjY5MDAyfQ.ggs56TjV4JMSMTu-Y9fOPwp3UBmCRFeqfEu7PkfxyYU
