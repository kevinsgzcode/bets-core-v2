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

//Schema for creating a a pick
export const createPickSchema = z.object({
  league: z.string().min(2, "League name is too short"),
  matchDate: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid date is required",
    }),
  homeTeam: z.string().min(2, "Home team required"),
  awayTeam: z.string().min(2, "Away team required"),
  selection: z.string().min(1, "Selection is required"),
  odds: z.coerce.number().min(1.01, "Odds must be greater than 1.0"),
  stake: z.coerce.number().positive("Stake must be a positive number"),
  category: z.enum(["NFL", "SOCCER"]).default("NFL"),
});

export type CreatePickSchema = z.infer<typeof createPickSchema>;
