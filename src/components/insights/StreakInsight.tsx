"use client";

import { Flame, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreakInsight } from "@/lib/insights/streak";

interface StreakInsightProps {
  data: StreakInsight | null;
  view: "ALL" | "CYCLE";
}

export function StreakInsight({ data, view }: StreakInsightProps) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm text-slate-600">Streaks</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Not enough data yet for this {view === "CYCLE" ? "run" : "period"}.
        </CardContent>
      </Card>
    );
  }

  const { currentStreak, bestWinStreak, worstLoseStreak } = data;

  const hasCurrentStreak = currentStreak.type && currentStreak.count > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900">
          Streaks
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {hasCurrentStreak && (
          <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            {currentStreak.type === "WIN" ? (
              <Flame className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-500" />
            )}
            {currentStreak.count}{" "}
            {currentStreak.type === "WIN" ? "wins" : "losses"} in a row
          </div>
        )}

        <div className="text-xs text-slate-500">
          Best win streak 🔥:{" "}
          <span className="font-medium text-slate-700">{bestWinStreak}</span>
        </div>

        <div className="text-xs text-slate-500">
          Worst losing streak 🥶:{" "}
          <span className="font-medium text-slate-700">{worstLoseStreak}</span>
        </div>
      </CardContent>
    </Card>
  );
}
