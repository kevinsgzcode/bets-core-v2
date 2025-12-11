import { create } from "zustand";

type OddsFormat = "DECIMAL" | "AMERICAN";

interface SettingsStore {
  oddsFormat: OddsFormat;
  currency: string;

  //actions
  setFormat: (format: OddsFormat) => void;
  toggleFormat: () => void;

  setPreferences: (currency: string, oddsFormat: OddsFormat) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  //default values
  oddsFormat: "DECIMAL",
  currency: "MXM",

  setFormat: (format) => set({ oddsFormat: format }),

  toggleFormat: () =>
    set((state) => ({
      oddsFormat: state.oddsFormat === "DECIMAL" ? "AMERICAN" : "DECIMAL",
    })),

  setPreferences: (currency, oddsFormat) => set({ currency, oddsFormat }),
}));
