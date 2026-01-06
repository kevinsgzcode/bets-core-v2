"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartPoint {
  date: string;
  balance: number;
}

interface BankrollChartProps {
  data: ChartPoint[];
}

export function BankrollChart({ data }: BankrollChartProps) {
  //empty state
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Bankroll Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
            Start a new run to see your bankroll growth 📈
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine Profit/Loss status
  const startBalance = data[0].balance;
  const currentBalance = data[data.length - 1].balance;
  const isProfit = currentBalance >= startBalance;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Bankroll Growth</CardTitle>
        <p className="text-xs text-slate-400">
          Updated daily based on settled bets
        </p>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isProfit ? "#10b981" : "#ef4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isProfit ? "#10b981" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                // FIX: This forces the first and LAST label to always show
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                // Optional: Dynamic domain to make the curve more dramatic
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`$${value}`, "Bankroll"]}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={isProfit ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
