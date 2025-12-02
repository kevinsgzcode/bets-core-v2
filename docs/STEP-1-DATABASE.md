# Step 1: Database Architecture & Modeling

## 1. Context & Problem Statement

**The Challenge:** The application requires a rigid data structure to handle financial calculations (betting bankroll) and multi-sport logic. The previous API-dependent model was volatile; we needed a persistent "Source of Truth."

**The Goal:** Design a Relational Database Schema that supports:

- User Authentication (NextAuth adapter).
- Betting history with specific constraints (Enums for Status and Sport).
- Hybrid resolution strategy (Auto-updates via API + Manual fallback).

## 2. Technical Decisions

### Database: PostgreSQL (via Supabase)

- **Why:** Relational integrity is non-negotiable for financial data. Supabase provides a managed instance with built-in backup and scaling.

### ORM: Prisma (v5.x LTS)

- **Why:** Type-safe database access. We specifically chose the LTS version (v5.22) over the bleeding-edge v7.0 to ensure compatibility with standard connection pooling and avoid experimental configuration breaking changes.

### Schema Design (Key Highlights)

- **`Pick` Model:** Decoupled from the external API. It stores `matchDate` and `externalGameId` to enable the future "Worker" service to resolve bets asynchronously.
- **Enums:** Used `PickStatus` (PENDING, WON, LOST...) to prevent invalid states at the database level.

## 3. Roadblocks & Solutions

**Issue:** Prisma v7.0.1 introduced a breaking change in schema configuration (`prisma.config.ts`), causing migration failures with standard connection strings.
**Resolution:** Executed a strategic downgrade to Prisma v5.22.0 (Stable).
**Lesson:** In production-grade software, stability and standard compliance often outweigh "new features."

## 4. Results

- [x] Connected Next.js to Supabase PostgreSQL.
- [x] Defined complete schema including `User`, `Account`, and `Pick` models.
- [x] Successfully ran initial migration (`init_schema`).

---
