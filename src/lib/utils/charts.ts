import { Pick } from "@prisma/client";
import { calculatePotentialProfit } from "./odds";

interface ChartPoint {
  date: string;
  balance: number;
}

export function generateBankrollTrend(
  picks: Pick[],
  initialBank: number = 0
): ChartPoint[] {
  const sortedPicks = [...picks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let currentBank = initialBank;
  const dailyBalance = new Map<string, number>();

  sortedPicks.forEach((pick) => {
    if (pick.status === "PENDING") return;

    if (pick.status === "WON") {
      currentBank += calculatePotentialProfit(
        pick.stake,
        pick.odds,
        pick.bonus ?? 0
      );
    }

    if (pick.status === "LOST") {
      currentBank -= pick.stake;
    }

    // PUSH = no change

    const dayKey = new Date(pick.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Always overwrite
    dailyBalance.set(dayKey, Number(currentBank.toFixed(2)));
  });

  const data: ChartPoint[] = [
    { date: "Start", balance: Number(initialBank.toFixed(2)) },
  ];

  dailyBalance.forEach((balance, date) => {
    data.push({ date, balance });
  });

  return data;
}
