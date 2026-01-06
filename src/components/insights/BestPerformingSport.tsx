"use client";

import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { useSettingsStore } from "@/lib/store";

interface BestSportData {
  sport: string;
  profit: number;
  winRate: number;
  totalBets: number;
}

interface BestPerformingSportProps {
  data: BestSportData | null;
  view: "ALL" | "CYCLE";
}

export function BestPerformingSport({ data, view }: BestPerformingSportProps) {
  const { currency } = useSettingsStore();

  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-slate-400" />
            Best Performing Sport
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Not enough data yet for this {view === "CYCLE" ? "run" : "period"}.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Best Performing Sport
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-slate-900">{data.sport}</div>

        <div className="text-sm text-slate-600">
          Profit:{" "}
          <span
            className={`font-medium ${
              data.profit >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {data.profit > 0 ? "+" : ""}
            {formatCurrency(data.profit, currency)}
          </span>
        </div>

        <div className="text-xs text-slate-500">
          Win rate:{" "}
          <span className="font-medium text-slate-700">
            {data.winRate.toFixed(1)}%
          </span>{" "}
          · {data.totalBets} bets
        </div>
      </CardContent>
    </Card>
  );
}
