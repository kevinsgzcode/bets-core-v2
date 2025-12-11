# Step 5: Financial Engine & Bankroll Management

## 1. Context & Problem Statement

**The Goal:** Transform the application from a simple betting tracker into a realistic financial management tool.
**The Problem:** The initial MVP had critical logic flaws regarding financial integrity:

1.  **Infinite Money Glitch:** Users could place bets even with a $0 or negative balance, leading to unrealistic scenarios.
2.  **Static Bankroll:** The "Current Bank" was hardcoded or static, meaning deposits and withdrawals were not tracked, making the "Net Profit" and "ROI" metrics inaccurate over time.
3.  **Withdrawal Loophole:** Users could theoretically withdraw more money than they actually possessed.

## 2. Technical Implementation

### Database Architecture (Prisma & PostgreSQL)

- **New Model:** Introduced a `Transaction` model to record external money flow (Deposits/Withdrawals) separately from betting performance.
- **Enums:** Defined `TransactionType` (DEPOSIT, WITHDRAWAL) to strictly categorize financial movements.
- **Relation:** Established a one-to-many relationship between `User` and `Transaction`, enabling a complete audit trail of the user's wallet history.

### Server-Side Logic (Next.js Server Actions)

- **`actions/wallet.ts`:** Implemented `createTransaction` with a strict **Solvency Check**. Before processing a withdrawal, the server aggregates all past deposits, withdrawals, and betting outcomes to ensure the user has sufficient liquid funds.
- **`actions/picks.ts`:** Updated the `createPick` action to include a **Bankruptcy Protection** check. The system now rejects any new bet if the stake exceeds the user's calculated current bankroll.

### Mathematical Core (`utils/stats.ts`)

- **Dynamic Bankroll Calculation:** Moved away from static values. The bankroll is now calculated in real-time:
  $$Bankroll = (\sum Deposits - \sum Withdrawals) + (\sum Payouts - \sum Stakes)$$
- **True ROI Formula:** Corrected the Return on Investment metric to be based on **Turnover** (Total Amount Wagered) rather than the total bankroll. This prevents the metric from being artificially diluted by large deposits.

### User Interface (Shadcn/UI)

- **Wallet Modal:** Created a tabbed interface (Deposit/Withdraw) for easy fund management.
- **Visual Feedback:** Updated `CreatePickModal` to strictly disable the "Add Pick" button when the user is bankrupt, replacing it with a destructive alert guiding them to recharge their wallet.

## 3. Roadblocks & Solutions

**Issue:** "Phantom Money" betting.
**Resolution:** Implemented a double-layer validation.

1.  **Frontend:** UI blocks the action button if `currentBank <= 0`.
2.  **Backend:** Critical server-side validation throws an error if `stake > availableBalance`, ensuring API integrity even if the UI is bypassed.

**Issue:** ROI calculation was misleading when users deposited fresh funds.
**Resolution:** Decoupled "External Money" (Deposits) from "Performance Money" (Profit). The ROI now strictly measures the efficiency of the bets placed, regardless of how much capital the user adds to their account.

## 4. Results

- [x] Full "Double-Entry" style bookkeeping system implemented.
- [x] Secured "Withdrawal" system that prevents negative balances.
- [x] "Game Over" state implemented: Users cannot bet without funds.
- [x] Financial metrics (ROI, Profit) are now mathematically rigorous and audit-proof.

---
