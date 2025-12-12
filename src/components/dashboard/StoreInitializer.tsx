"use client";

import { useRef } from "react";

import { useSettingsStore } from "@/lib/store";

interface StoreInitializerProps {
  currency: string;
  oddsFormat: string;
}

export function StoreInitializer({
  currency,
  oddsFormat,
}: StoreInitializerProps) {
  const initialized = useRef(false);

  const { setPreferences } = useSettingsStore();

  if (!initialized.current) {
    // Validamos que el formato sea estrictamente el tipo esperado
    const validFormat = oddsFormat === "AMERICAN" ? "AMERICAN" : "DECIMAL";

    setPreferences(currency, validFormat);
    initialized.current = true;
  }

  return null;
}
