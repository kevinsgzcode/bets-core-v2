"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store";

interface StoreInitializerProps {
  currency: string;
  oddsFormat: string;
}

export function StoreInitializer({
  currency,
  oddsFormat,
}: StoreInitializerProps) {
  const initialized = useRef(false);
  const { setPreferences } = useUserStore();

  if (!initialized.current) {
    const validFormat = oddsFormat === "DECIMAL" ? "DECIMAL" : "AMERICAN";

    setPreferences(currency, validFormat);
    initialized.current = true;
  }
  return null;
}
