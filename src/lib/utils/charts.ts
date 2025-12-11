import { Pick } from "@prisma/client";
import { calculatePotentialProfit } from "./odds";

interface ChartPoint {
  date: string;
  balance: number;
}

export function generateBankrollTrend(
  picks: Pick[],
  initialBank: number = 1000
): ChartPoint[] {
  const sortedPicks = [...picks].sort(
    (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
  );

  let currentBank = initialBank;

  //start chart with initial bank roll
  const data: ChartPoint[] = [{ date: "Start", balance: initialBank }];

  //iterate and acumulate
  sortedPicks.forEach((pick) => {
    if (pick.status === "WON" || pick.status === "LOST") {
      const profit =
        pick.status === "WON"
          ? calculatePotentialProfit(pick.stake, pick.odds)
          : -pick.stake; //if lost profit is negative stake

      currentBank += profit;

      data.push({
        date: new Date(pick.matchDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        balance: Number(currentBank.toFixed(2)),
      });
    }
  });

  return data;
}
