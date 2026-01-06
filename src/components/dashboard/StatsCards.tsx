"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Wallet, History, Zap } from "lucide-react";
import { useSettingsStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils/format";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsCardsProps {
  runStats: any | null;
  lifetimeStats: any;
  view: "ALL" | "CYCLE";
  onViewChange: (view: "ALL" | "CYCLE") => void;
}

export function StatsCards({
  runStats,
  lifetimeStats,
  view,
  onViewChange,
}: StatsCardsProps) {
  const { currency } = useSettingsStore();

  // -----------------------------
  // Derived values
  // -----------------------------
  const isCycle = true;

  const equity = runStats?.equity ?? 0;

  //const currentBank = runStats?.equity ?? 0;

  const initialBank = runStats?.initialBank ?? 0;

  const profit = isCycle ? runStats?.profit ?? 0 : lifetimeStats.netProfit;

  const roi = isCycle ? runStats?.roi ?? 0 : lifetimeStats.roi;

  const winRate = !isCycle ? lifetimeStats.winRate : null;

  //const netInvested = lifetimeStats.netInvested;

  const pendingStake = runStats?.pendingStake ?? 0;

  //const availableToBet = currentBank - pendingStake;

  //const availableBankroll = runStats?.availableBankroll ?? 0;

  //const committedStake = runStats
  //  ? runStats.equity - runStats.availableBankroll
  //  : 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="grid gap-4 md:grid-cols-3">
        {/* CARD 1: EQUITY / NET INVESTED */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isCycle ? "Current bank" : "Net Invested"}
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-2">
              {formatCurrency(equity, currency)}
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <div>
                Started at{" "}
                <span className="font-medium text-slate-700">
                  {formatCurrency(initialBank, currency)}
                </span>
              </div>

              {pendingStake > 0 && (
                <div>
                  Money in pending:{" "}
                  <span className="font-medium text-slate-700">
                    {formatCurrency(pendingStake, currency)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: PROFIT */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isCycle ? "Profit / Loss" : "Lifetime Profit"}
            </CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                profit >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-extrabold ${
                profit >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {profit > 0 ? "+" : ""}
              {formatCurrency(profit, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isCycle
                ? "Performance since run start"
                : "All-time betting performance"}
            </p>
          </CardContent>
        </Card>

        {/* CARD 3: ROI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {isCycle ? "ROI" : "Lifetime ROI"}
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                roi >= 0 ? "text-indigo-600" : "text-rose-600"
              }`}
            >
              {roi > 0 ? "+" : ""}
              {roi.toFixed(2)}%
            </div>

            <div className="mt-2 text-xs text-slate-500">
              {!isCycle && winRate !== null ? (
                <>
                  Win Rate:{" "}
                  <span className="font-medium text-slate-700">
                    {winRate.toFixed(1)}%
                  </span>
                </>
              ) : (
                <span>Return on invested capital</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
