# Bets Core 📊

A production-ready web application for tracking, analyzing, and improving sports betting performance through data-driven insights

Built as a real-world product with authentication, analytics, and a scalable backend.

🚀 Live Demo  
https://bets-core-v2.vercel.app
🔐 Private beta – access via invitation only
(If you are interesting to try just let me know to give you an access)

## Why bets tracker?

Bets Core is a full-stack analytics platform that allows users to:

- Log individual picks and transactions
- Group picks into active "runs"
- Automatically calculate:
  - ROI
  - Profit & loss
  - Streaks
  - Best performing sports
- Visualize lifetime vs run-based performance
- Access everything securely via passwordless email authentication

##  Key Features

- Passwordless authentication (Magic Link)
- Run-based and lifetime analytics
- Real-time stats recalculation
- Bankroll & transaction tracking
- Performance insights (streaks, best sport)
- Production-ready deployment

## Project Status

- Live in production
- Private beta (invite-only)
- Actively iterating based on real usage
- Continuous improvements and bug fixes

## Architecture Highlights

- Server-first architecture using Next.js App Router
- Authentication handled at the edge with protected routes
- Database access abstracted through Prisma
- Strong separation between:
  - UI components
  - Business logic
  - Data access
- Defensive programming to prevent hard crashes in production

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React Server Components
- TypeScript
- Tailwind CSS

**Backend**
- Next.js Server Actions
- Prisma ORM
- PostgreSQL (Supabase)

**Authentication**
- Auth.js (NextAuth v5)
- Email Magic Link (Passwordless)
- Beta access control via allowlist

**Infrastructure**
- Vercel (Production deployment)
- Supabase (Database + pooling)
- Prisma Client generation on build

**Developer Experience**
- Husky + Commitlint
- ESLint
- Typed schemas with Zod

## Local Development

```bash
npm install
npm run dev



