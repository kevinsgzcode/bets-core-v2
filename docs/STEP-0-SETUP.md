# Step 0: Architecture & Environment Setup

## 1. Context & Problem Statement

**The Challenge:** The previous version of "Bets Core" was built with Vanilla JS, lacking type safety, scalability, and a standardized development workflow. This made the codebase prone to runtime errors and difficult to maintain as features grew.

**The Goal:** Establish a professional, scalable foundation ("Scaffolding") before writing business logic, ensuring strict code quality standards from the very first commit.

## 2. Technical Stack Implementation

### Framework: Next.js 15 (App Router)

- **Why:** To leverage Server-Side Rendering (SSR) for initial data loads and SEO, while using Client Components for the interactive dashboard.
- **Impact:** Improved performance and a modern directory structure that separates routing from logic.

### Language: TypeScript

- **Why:** To replace loose JavaScript objects with strict Interfaces.
- **Impact:** Drastic reduction of "undefined" errors at runtime. Self-documenting code for future scalability.

### Quality Control: ESLint + Prettier

- **Why:** To enforce consistent code style automatically.
- **Impact:** The codebase looks like it was written by one person, regardless of team size.

### Git Hygiene: Husky + Commitlint

- **Why:** To prevent bad commits (e.g., "fixed bug") and ensure Semantic Versioning compliance (e.g., `fix: resolve calculation error`).
- **Impact:** A clean, readable git history that automates changelog generation.

## 3. Results

- [x] Initialized Next.js project with App Router.
- [x] Configured Git repository with `main` branch protection philosophy.
- [x] Implemented Pre-commit hooks (Husky) to block non-compliant code.
- [x] Verified workflow with Semantic Commits (`chore`, `feat`, `fix`).

---
