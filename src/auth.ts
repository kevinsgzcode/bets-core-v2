import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        host: "localhost",
        port: 25,
        auth: {
          user: "",
          pass: "",
        },
      },

      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        if (!ALLOWED_EMAILS.includes(identifier)) {
          console.warn(`Blocked login attempt for ${identifier}`);
          return;
        }

        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: identifier,
          subject: "Sign in to Bets Core",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <h2>Welcome to Bets Tracker 👋</h2>
              <p>Click the button below to sign in:</p>
              <a href="${url}" style="
                display: inline-block;
                margin-top: 16px;
                padding: 12px 20px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              ">
                Sign in
              </a>
              <p style="margin-top: 24px; font-size: 12px; color: #666;">
                If you didn’t request this email, you can safely ignore it.
              </p>
            </div>
          `,
        });
      },
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
