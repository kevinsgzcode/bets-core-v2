import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const ALLOWED_EMAILS = [
  "kevinsgz.code@gmail.com",
  "luis.montesgz96@gmail.com",
  "naranjo_villegas@hotmail.com",
  "kevnmotionsgz@gmail.com",
  "milsentidos1@gmail.com",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Email({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
    verifyRequest: "/login?checkEmail=true",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return ALLOWED_EMAILS.includes(user.email);
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
