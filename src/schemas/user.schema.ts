import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    // 'required_error' er bodole .min(1, "...") use koro
    name: z.string().min(1, "Name is required"),

    // Email validation er prothomei .min(1) diye empty check koro
    email: z.string().min(1, "Email is required").email("Invalid email format"),

    // Password min length check
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
