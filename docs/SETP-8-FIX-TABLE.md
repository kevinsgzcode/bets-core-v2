# Step 08 — Table UX: Visual Financial Feedback & Data Integrity

## Overview

In this step, I transformed the main "History Table" from a simple data list into a **Financial Tool**.
Raw data is useless if the user cannot quickly interpret their performance.I focused on visual hierarchy (Profit vs Loss) and data accuracy (Timezones).

---

## The Challenge

Our initial table implementation (TanStack Table) had three major UX flaws:

1.  **Cognitive Load:** The "Est. Profit" column was generic. Users had to read the text to know if they won or lost.
2.  **Date Confusion:** Dates were stored in UTC, causing events to appear on the "wrong day" depending on the user's local time.
3.  **Navigation:** With growing data, the list became endless without pagination.

---

## Key Implementations

### 1. Visual Profit/Loss (P/L) Logic

Replaced the generic "Est. Profit" column with a dynamic **P/L** column that reacts to the bet status.

- **WON:** Displays positive net profit in **Green** (e.g., `+$45.50`).
- **LOST:** Displays the lost stake in **Red** (e.g., `-$50.00`).
- **PENDING:** Displays potential profit in neutral Gray.

**Why?** This leverages the "Traffic Light" psychology. A user can now scan their history and instantly grasp their recent performance without doing mental math.

### 2. Timezone Correction

I implemented a client-side date fix using `date-fns` and `addMinutes` to offset the timezone difference.

- **Problem:** User selects "Dec 10", DB saves "Dec 10 00:00 UTC", User sees "Dec 9" (due to CST offset).
- **Fix:** We visually adjust the date in the `columns.tsx` render layer to respect the user's input intent.

### 3. Filters & Pagination

We enabled TanStack Table's built-in pagination engine and added a generic Status Filter.

- **Pagination:** Defaults to 10 rows per page to keep the UI clean.
- **Filtering:** Added a dropdown to quickly isolate "Pending" bets from settled ones.

---

## Final Results of Step 08

**Dashboard now:**

- Provides immediate visual feedback on financial performance.
- Respects the date the user _intended_ to save.
- Scales gracefully with hundreds of records via pagination.

This moves the dashboard from a "Spreadsheet" feel to a "SaaS Application" feel.
