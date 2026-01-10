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
  //sorted picks chronologically
  const sortedPicks = [...picks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let currentBank = initialBank;

  const dailyBalance = new Map<string, number>();

  sortedPicks.forEach((pick) => {
    //ignore pending status
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

    const dayKey = new Date(pick.createdAt).toISOString().split("T")[0];

    // Always overwrite
    dailyBalance.set(dayKey, Number(currentBank.toFixed(2)));
  });

  //sort daily balance chronologically
  const sortedDaily = Array.from(dailyBalance.entries()).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  const data: ChartPoint[] = [];

  //initial point
  data.push({
    date: "Start",
    balance: Number(initialBank.toFixed(2)),
  });

  //daily point

  sortedDaily.forEach(([date, balance]) => {
    data.push({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      balance,
    });
  });

  return data;
}
