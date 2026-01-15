import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { email } from "zod";

const ALLOWED_EMAILS = [
  "kevinsgz.code@gmail.com",
  "luis.montesgz96@gmail.com",
  "naranjo_villegas@hotmail.com",
  "kevnmotionsgz@gmail.com",
  "milsentidos1@gmail.com",
];

const isDev = process.env.NODE_ENV === "development";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: isDev
    ? [
        Credentials({
          name: "Dev Login",
          credentials: {},
          async authorize() {
            return {
              id: "dev-user",
              email: "dev@betscore.local",
              name: "Dev user",
            };
          },
        }),
      ]
    : [
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
    strategy: isDev ? "jwt" : "database",
  },

  pages: {
    signIn: "/login",
    verifyRequest: "/login?checkEmail=true",
  },

  callbacks: {
    async signIn({ user }) {
      //dev user
      if (isDev) {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {},
          create: {
            email: user.email!,
            name: user.name ?? "Dev user",
          },
        });
        return true;
      }

      if (!user.email) return false;
      return ALLOWED_EMAILS.includes(user.email);
    },
    //dev
    async jwt({ token, user }) {
      if (isDev && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, user, token }) {
      if (session.user) {
        if (user?.id) {
          session.user.id = user.id;
        }
        //dev
        if (!user && token?.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
});
