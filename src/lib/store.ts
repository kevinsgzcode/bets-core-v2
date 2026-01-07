import { create } from "zustand";

type OddsFormat = "DECIMAL" | "AMERICAN";

interface SettingsStore {
  oddsFormat: OddsFormat | null;
  currency: string | null;

  setPreferences: (currency: string, oddsFormat: OddsFormat) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  oddsFormat: null,
  currency: null,

  setPreferences: (currency, oddsFormat) =>
    set({
      currency,
      oddsFormat,
    }),
}));
