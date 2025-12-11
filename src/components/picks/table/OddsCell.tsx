"use client";

import { useSettingsStore } from "@/lib/store";
import { decimalToAmerican } from "@/lib/utils/odds";

interface OddsCellProps {
  decimalValue: number;
}

export function OddsCell({ decimalValue }: OddsCellProps) {
  const { oddsFormat } = useSettingsStore();

  //If global preference is American, convert it. Otherwise, show decimal.
  const displayValue =
    oddsFormat === "AMERICAN"
      ? decimalToAmerican(decimalValue)
      : decimalValue.toFixed(2);

  return <div className="font-mono text-xs text-slate-600">{displayValue}</div>;
}
