import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      // Definition of the credentials we expect
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The logic to verify if the user exists and password matches
      authorize: async (credentials) => {
        // Validate inputs using Zod Schema
        // safeParse doesn't throw errors, it returns an object with success status
        const validatedFields = signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          // Invalid format
          return null;
        }

        const { email, password } = validatedFields.data;

        //  Find user in Database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If no user found, or user exists but has no password (e.g. Google Login user)
        if (!user || !user.password) {
          return null;
        }

        // Compare passwords (Input vs Hashed in DB)
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          // Return the user object
          return user;
        }
        // Password incorrect
        return null;
      },
    }),
  ],
});
