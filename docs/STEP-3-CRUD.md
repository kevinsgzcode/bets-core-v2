# Step 3: Core Betting Logic (CRUD)

## Context & Problem Statement

**The Goal:** Enable users to register betting picks with precise financial data and visualize them in a dashboard history.
**The Challenge:** Handling complex form states (Team Search, Odds Conversion, Real-time Calculation) while maintaining data integrity in the backend.

## Technical Implementation

### Frontend: Smart Forms

- **Library:** `react-hook-form` + `zod` resolver.
- **Component:** `CreatePickForm` handles multi-step logic.
  - **Combobox:** Implemented a searchable dropdown (`TeamCombobox`) for NFL teams to ensure standardized data entry.
  - **Odds Converter:** Developed a bi-directional input that allows users to type in American Odds (-110) while storing Decimal Odds (1.91) in the database.
  - **Live Calculator:** Displays "Net Profit" vs "Total Payout" in real-time to avoid user confusion.

### Backend: Server Actions

- **Action:** `createPick` handles authentication validation, data parsing, and DB insertion via Prisma.
- **Security:** Implemented `auth.ts` callbacks to inject `userId` into the session, ensuring picks are strictly linked to the authenticated user.

### Data Fetching

- **Strategy:** Server Components approach (`getUserPicks` in `lib/data.ts`) to fetch data directly on the server, eliminating client-side loading spinners and improving SEO/Performance.

## Roadblocks & Solutions

**Issue:** "Uncontrolled input" error in React when initializing the form.
**Resolution:** Defined strict `defaultValues` in `useForm` for all fields (including empty strings for teams) to ensure inputs are always controlled.

**Issue:** User confusion between "Profit" and "Payout".
**Resolution:** Redesigned the calculator UI to explicitly show both values, matching standard sportsbook interfaces.

**Issue:** Displaying raw IDs (e.g., "arizona-cardinals") in the UI.
**Resolution:** Implemented a lookup helper in `PickCard` using the shared `NFL_TEAMS` constant dictionary.

## Results

- [x] Functional "Add Pick" Modal with searching and validation.
- [x] Robust Odds conversion logic (American <-> Decimal).
- [x] Dashboard Grid displaying user's betting history.
- [x] Data persistence in Supabase PostgreSQL.

---
