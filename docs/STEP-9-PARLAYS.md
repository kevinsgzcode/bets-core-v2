# Step 09 — Parlay Logic: Frictionless Data Entry & Strategy Segmentation

## Overview

In this step, I expanded the core data entry capabilities to support **Parlays (Accumulators)** without disrupting the user experience.
The goal was to solve a common pain point in betting trackers: the tediousness of logging multi-leg bets. We introduced a "Dual-Mode" form that adapts the interface based on the bet type, prioritizing speed over unnecessary granularity.

---

## The Challenge

Standard betting trackers often force users to log every single leg of a parlay individually to get accurate stats. This creates high friction:

1.  **Data Entry Fatigue:** Logging a 6-leg parlay shouldn't take 6 times longer than a single bet.
2.  **Loss of Context:** Treating a parlay as just "another bet" hides crucial performance data (e.g., "Am I losing money specifically on Mixed Sports parlays?").
3.  **UI Clutter:** One massive form for all bet types confuses the user.

---

## Key Implementations

### 1. The "Parlay Mode" Toggle (State-Driven UI)

I implemented a global `Parlay Mode` switch at the top of the form. This triggers a complete UI state change using **React Hook Form** and conditional rendering.

- **Standard Mode:** Focuses on precise Event Description and Pick details.
- **Parlay Mode:** Shifts focus to **Composition** (Metadata) and **Summary**.
- **Impact:** The user feels like they are using a tool designed specifically for the task at hand, reducing cognitive load.

### 2. Metadata over Granularity

Instead of forcing the user to input every single match in a combo, I designed the schema to capture the **Statistical Metadata** that actually drives decision-making:

- **Composition:** (e.g., `NFL Only`, `Mixed Sports`, `NBA Player Props`). This allows for future filtering by strategy.
- **Picks Count:** A numeric field to track the size of the parlay. This is critical for future analytics (e.g., "Win Rate on 3-Legs vs 5-Legs").
- **Summary/Key Pick:** A simplified text field to capture the "essence" of the ticket without the boilerplate.

### 3. Visual Context Switching

The UI provides immediate feedback when switching modes:

- **Color Cues:** The form structure changes subtly to indicate a different context.
- **Adaptive Placeholders:** Labels and placeholders update dynamically (e.g., from "Event Description" to "Parlay Summary / Note") to guide the user.

---

## Final Results of Step 09

**Dashboard now:**

- **Reduces Friction:** Users can log a complex 10-leg parlay in seconds.
- **Enables Advanced Analytics:** We are now collecting structured data (`composition`, `picks_count`) that will power the "Parlay Performance" charts in V2.
- **Maintains Data Integrity:** Segregates Single bets from Parlays at the input level, ensuring clean data for ROI calculations.

This update solidifies the "Bets Core" philosophy: **Maximum Insights, Minimum Effort.**
