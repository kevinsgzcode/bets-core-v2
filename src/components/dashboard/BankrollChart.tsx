"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Pick } from "@prisma/client";
import { generateBankrollTrend } from "@/lib/utils/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankrollChartProps {
  picks: Pick[];
}

export function BankrollChart({ picks }: BankrollChartProps) {
  // Calculate trend data
  // TODO: In the future, '1000' should come from the User's Settings in DB
  const data = generateBankrollTrend(picks, 1000);

  const isProfit = data[data.length - 1].balance >= 1000;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Bankroll Growth</CardTitle>
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
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
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
