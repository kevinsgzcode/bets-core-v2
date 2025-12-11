# step 7: Hybrid Architecture & Universal Betting Support

## 1. Context & Problem Statement

**The Goal:** Evolve the application from a niche NFL tracker into a universal sports betting dashboard.
**The Problem:** The initial data model was too rigid. It strictly required a `HomeTeam` and `AwayTeam` for every record.

- **Limitation:** Users could not track individual sports (Tennis, F1, UFC) or future bets (e.g., "Super Bowl Winner") because these events do not fit the "Team A vs Team B" structure.
- **User Friction:** If a user wanted to bet on a non-NFL event, they were forced to leave the app and return to Excel, breaking the ecosystem.

## 2. Technical Implementation

### Database Schema Evolution (Prisma)

- **Nullable Fields:** Refactored `homeTeam`, `awayTeam`, and `league` to be optional (`String?`). This allows records to exist without strict team IDs.
- **New Fields:**
  - `isManual` (Boolean): A flag to render the UI differently for custom bets.
  - `eventDescription` (String): Stores free-text context (e.g., "Verstappen Top 3 - GP Mexico") for non-team sports.
  - `sport` (String): Added a categorical field to enable future filtering by sport (Soccer, Tennis, F1, etc.).

### Advanced Validation (Zod Discriminated Union)

- Implemented a **Discriminated Union** pattern in Zod.
- The schema dynamically changes requirements based on the `mode` field:
  - If `mode === 'SMART'`: Requires `homeTeam` + `awayTeam` (Strict).
  - If `mode === 'MANUAL'`: Requires `eventDescription` (Flexible).
- This ensures data integrity without compromising flexibility.

### Frontend Architecture & Feature Flagging

- **Dynamic Form:** The `CreatePickForm` now renders different inputs based on the selected mode.
- **Visual Adaptation:** The Data Table (`columns.tsx`) was updated with defensive programming to handle null values. It now intelligently displays either the "Matchup" (Bills @ Chiefs) or the "Event Description" (GP Mexico) based on the record type.
- **Strategic MVP Lock (Feature Flag):**
  - While the "Smart Mode" (API integration) architecture is built, we decided to **Feature Flag (disable)** it for the initial production release.
  - The UI is currently locked to "Manual Mode" to ensure 100% stability and universal usability while the NFL automation engine is finalized.

## 3. Roadblocks & Solutions

**Issue:** Frontend crashes in the Data Table.
**Cause:** The table component attempted to run string manipulation methods (like `.substring()`) on `null` team IDs when rendering manual picks.
**Resolution:** Implemented robust "Safe Access" helpers (`getTeamAbbr`) that check for null values before processing, returning a fallback or the raw event description.

**Issue:** Complexity in Form State.
**Resolution:** Used React Hook Form's `watch` method combined with conditional rendering to swap entire sections of the form DOM (Inputs vs Comboboxes) without losing the shared financial state (Odds/Stake).

## 4. Results

- [x] **Universal Support:** The system can now track bets for ANY sport, election, or custom event.
- [x] **Hybrid Database:** The backend is ready for both manual entry and future API automation without further schema migrations.
- [x] **Stable MVP:** By locking the "Smart Mode" temporarily, we removed the risk of API failures for the launch, prioritizing a reliable tool over a complex one.

---
