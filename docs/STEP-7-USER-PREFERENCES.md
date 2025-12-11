# Step 7 — User Preferences, Global State & Dynamic Formatting

## Overview

This step focuses on **Personalization and Data Consistency**. Moved from a static, hardcoded dashboard to a dynamic environment where the UI adapts instantly to the user's choices (Currency and Odds Format) defined during the Onboarding phase.

To achieve this without complex prop-drilling, I introduced a global state management solution using **Zustand** and implemented a robust Server-to-Client hydration strategy.

---

## Why Global State Matters Here

As the application grows, passing `currency` and `oddsFormat` props from the `page.tsx` down to every chart, card, and form becomes unmanageable.

needed a "single source of truth" on the client side that:

1.  **Syncs with the Database:** Respects what the user saved in Postgres.
2.  **Reacts Instantly:** If a preference changes, the whole UI updates.
3.  **Calculates Automatically:** Forms should know if they need to validate for American or Decimal odds.

---

# Implementing The Global Store

### (Zustand Integration)

We created a lightweight store `useSettingsStore` to manage user preferences globally.

### ✔ The Store Structure

Located in `src/lib/store.ts`:

```typescript
interface SettingsStore {
  oddsFormat: "DECIMAL" | "AMERICAN";
  currency: string;
  setPreferences: (
    currency: string,
    oddsFormat: "DECIMAL" | "AMERICAN"
  ) => void;
}
```

---

# Financial Integrity & UX

With the store in place, we updated the UI to respect the user's financial context.

### ✔ Intelligent Currency Formatting

Replaced hardcoded $ symbols with a robust utility based on Intl.NumberFormat.

Before: $1000 (Always USD/Generic)

After: $1,000.00 MXN or €1,000.00 EUR (Context-aware)

This was applied to the StatsCards component, ensuring the "Net Profit" and "Bankroll" cards reflect the real monetary value.

### ✔ Reactive Forms (CreatePickForm)

The form now "listens" to the global state.

If the user prefers American Odds, the input defaults to -110.

If the user prefers Decimal Odds, the input defaults to 1.91.

Clean UX: removed the manual "Toggle Format" switch from the UI. The interface now implicitly trusts the user's onboarding choice, reducing cognitive load.
