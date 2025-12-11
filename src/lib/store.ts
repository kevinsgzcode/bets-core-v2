import { create } from "zustand";

type OddsFormat = "DECIMAL" | "AMERICAN";

interface SettingsStore {
  oddsFormat: OddsFormat;
  setFormat: (format: OddsFormat) => void;
  toggleFormat: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  //default value
  oddsFormat: "DECIMAL",

  setFormat: (format) => set({ oddsFormat: format }),

  toggleFormat: () =>
    set((state) => ({
      oddsFormat: state.oddsFormat === "DECIMAL" ? "AMERICAN" : "DECIMAL",
    })),
}));
