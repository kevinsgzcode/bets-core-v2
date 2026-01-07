"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/lib/store";

type Props = {
  currency: string;
  oddsFormat: "DECIMAL" | "AMERICAN";
};

export function StoreInitializer({ currency, oddsFormat }: Props) {
  const setPreferences = useSettingsStore((s) => s.setPreferences);

  useEffect(() => {
    setPreferences(currency, oddsFormat);
  }, [currency, oddsFormat, setPreferences]);

  return null;
}
