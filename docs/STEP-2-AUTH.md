# Step 2: Secure Authentication System

## Context & Problem Statement

**The Challenge:** The application needed a secure way to manage user sessions without storing sensitive data (passwords) in plain text or relying on fragile client-side logic.
**The Goal:** Implement a robust Authentication layer using **Auth.js v5 (Beta)** integrated with PostgreSQL via Prisma, ensuring strictly typed server-side validation.

## Technical Implementation

### Core Stack

- **Library:** Auth.js v5 (NextAuth). Chosen for its native support of Next.js 15 Server Actions.
- **Strategy:** Credentials Provider (Email/Password) with stateless JWT sessions.
- **Security:** Passwords are hashed using `bcryptjs` before storage.

### Key Components

1.  **Database Adaptation:** Updated Prisma Schema to include `User` password fields.
2.  **Type-Safe Validation:** Implemented `Zod` schemas (`src/lib/zod.ts`) to validate inputs on both client and server before processing.
3.  **Server Actions:** Replaced traditional API routes with Server Actions (`authenticate`), allowing progressive enhancement and cleaner error handling.
4.  **Middleware/Routing:** Protected the main Dashboard (`page.tsx`) to redirect unauthenticated users automatically.

## 3. Roadblocks & Solutions

**Issue:** "Module Not Found" loop caused by incorrect import aliases (`@/auth` vs local paths) and cached build artifacts.
**Resolution:** Standardized the project structure by moving core logic to `src/lib` and `src/auth.ts`, ensuring `tsconfig.json` paths were correctly mapped, and clearing Next.js cache.

**Issue:** User was authenticated but not redirected (stuck on login page).
**Resolution:** Explicitly defined `redirectTo: '/'` in the `signIn` server action to force navigation upon success.

## 4. Results

- [x] Secure Login UI built with Tailwind CSS.
- [x] User registration seeding script created.
- [x] Functional Session Management (Login/Logout).
- [x] Protected Routes implementation.

---
