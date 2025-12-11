"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/utils/stats";
import { DollarSign, TrendingUp, Activity } from "lucide-react";
import { useSettingsStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils/format";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  // 1. Hook into the global store to get the user's preferred currency
  const { currency } = useSettingsStore();

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* CARD 1: CURRENT BANK */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Current Bankroll
          </CardTitle>
          <DollarSign className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {/* Dynamic formatting based on currency store */}
            {formatCurrency(stats.currentBank, currency)}
          </div>
          <p className="text-xs text-slate-500">
            {/* Note: Ideally, 'initialBank' should also come from stats/DB to be accurate here */}
            Total funds available
          </p>
        </CardContent>
      </Card>

      {/* CARD 2: NET PROFIT (Color Coded) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Net Profit
          </CardTitle>
          <TrendingUp
            className={`h-4 w-4 ${
              stats.netProfit >= 0 ? "text-green-500" : "text-red-500"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {/* We handle the '+' sign manually, formatCurrency handles the symbol ($/€) */}
            {stats.netProfit > 0 ? "+" : ""}
            {formatCurrency(stats.netProfit, currency)}
          </div>
          <p className="text-xs text-slate-500">All time performance</p>
        </CardContent>
      </Card>

      {/* CARD 3: ROI & WIN RATE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            ROI / Yield
          </CardTitle>
          <Activity className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          {/* ROI is a percentage, so it doesn't need currency formatting */}
          <div
            className={`text-2xl font-bold ${
              stats.roi >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {stats.roi >= 0 ? "+" : ""}
            {stats.roi.toFixed(2)}%
          </div>
          <p className="text-xs text-slate-500">
            Win Rate: {stats.winRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
