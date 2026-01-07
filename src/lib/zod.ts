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

//base schema
const basePickSchema = z.object({
  matchDate: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid date", {
      message: "Valid date is required",
    }),

  sport: z.string().min(1, "Sport is required"),

  odds: z.coerce.number().min(1.01, "Odds must be greater than 1.0"),

  stake: z.coerce.number().positive("Stake must be positive"),

  bonus: z.coerce.number().default(0),

  isParlay: z.boolean().default(false),

  legs: z.coerce.number().optional(),

  composition: z.string().optional(),

  league: z.string().default("NFL"),

  eventDescription: z.string().optional(),
});

//smart mode
//const smartPickSchema = basePickSchema.extend({
//mode: z.literal("SMART"),
//homeTeam: z.string().min(2, "Home team required"),
//awayTeam: z.string().min(2, "Away team required"),
//selection: z.string().min(1, "Selection required"),
//league: z.string().default("NFL"),
//});

//manual mode
const manualPickSchema = basePickSchema.extend({
  mode: z.literal("MANUAL"),
  eventDescription: z
    .string()
    .min(3, "Event description is required (e.g. Nadal vs Federer)"),
  selection: z.string().min(1, "Pick selection is required"),
});

//Schema for creating a a pick
export const createPickSchema = z.discriminatedUnion("mode", [
  manualPickSchema,
]);

export type CreatePickSchema = z.infer<typeof createPickSchema>;
