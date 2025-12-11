"use client";

import { useSettingsStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function FormatToggle() {
  const { oddsFormat, toggleFormat } = useSettingsStore();

  return (
    <div className="felx items-center spcae-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
      <Switch
        id="odds-mode"
        checked={oddsFormat === "AMERICAN"}
        onCheckedChange={toggleFormat}
      />
      <Label
        htmlFor="odds-mode"
        className="text-xs font-semibold text-slate-600 cursor-pointer w-16"
      >
        {oddsFormat}
      </Label>
    </div>
  );
}
