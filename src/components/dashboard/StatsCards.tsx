import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/utils/stats";
import { DollarSign, TrendingUp, Activity } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
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
            ${stats.currentBank.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500">Starting from $1,000.00</p>
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
            {stats.netProfit >= 0 ? "+" : ""}${stats.netProfit.toFixed(2)}
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
