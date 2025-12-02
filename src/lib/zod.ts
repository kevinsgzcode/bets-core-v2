import { z } from "zod";

// Schema for User Login
export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    // Added security layer: Min 8 chars
    .min(8, "Password must be at least 8 characters"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
