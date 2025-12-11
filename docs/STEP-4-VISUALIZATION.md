# Step 4: Data Visualization & Financial Analytics

## 1. Context & Problem Statement

**The Goal:** Transform raw betting data into actionable financial insights. Users need to understand their "health" (Bankroll trend) and efficiency (ROI) at a glance, without manually calculating values from a list.
**The Challenge:** The database stores individual transactions. We needed an efficient way to aggregate these records into time-series data for charts and cumulative KPIs for the overview.

## 2. Technical Implementation

### Algorithms & Math (`src/lib/utils`)

- **`stats.ts`:** Implemented `calculateStats` function to derive key metrics:
  - **Net Profit:** Sum of all won bets minus lost stakes.
  - **ROI (Return on Investment):** `(Net Profit / Initial Bank) * 100`.
  - **Win Rate:** Percentage of winning bets against total settled bets.
- **`charts.ts`:** Created a transformation algorithm (`generateBankrollTrend`) that:
  1.  Sorts picks chronologically.
  2.  Iterates through the history, maintaining a running cumulative balance.
  3.  Outputs a clean JSON array compatible with Recharts.

### UI Components (Dashboard)

- **Library:** `Recharts` for the trend line and `Lucide React` for iconography.
- **`StatsCards.tsx`:** A set of 3 cards displaying Bankroll, Profit, and ROI. Features conditional formatting (Green for profit, Red for loss) to provide immediate visual feedback.
- **`BankrollChart.tsx`:** An Area Chart visualizing the financial trajectory. It uses a gradient fill that adapts its color based on whether the user is currently profitable or not.

### Integration

- **Server-Side Calculation:** All math runs on the server within `page.tsx` before rendering. This ensures the client receives pre-calculated, ready-to-render data, maintaining high performance and Zero Layout Shift.

## 3. Roadblocks & Solutions

**Issue:** Discrepancy between "Total Payout" (what the sportsbook pays) and "Net Profit" (what the user actually earns).
**Resolution:** Standardized the dashboard to focus purely on **Net Profit** for analytics, as this is the true measure of a bettor's performance.

**Issue:** Chart rendering issues with container width.
**Resolution:** Wrapped the Recharts `ResponsiveContainer` within a fixed-height parent in the UI layout to ensure stable rendering during hydration.

## 4. Results

- [x] "Traffic Light" system implemented: Green/Red indicators for financial health.
- [x] Interactive Time-Series Chart showing bankroll evolution.
- [x] Mathematical accuracy verified against manual audit (e.g., matching Net Profit calculations).
- [x] Seamless integration of KPIs, Charts, and Data Table in a single view.

---
