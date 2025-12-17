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
    (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
  );

  const dailyOperations = sortedPicks.reduce((acc, pick) => {
    if (pick.status !== "WON" && pick.status !== "LOST") return acc;

    const dateObj = new Date(pick.matchDate);

    const dateKey = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Mexico_City",
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(pick);
    return acc;
  }, {} as Record<string, Pick[]>);

  let currentBank = initialBank;

  //start chart with initial bank roll
  const data: ChartPoint[] = [{ date: "Start", balance: initialBank }];

  //iterate and acumulate
  Object.keys(dailyOperations).forEach((dateKey) => {
    const daysPicks = dailyOperations[dateKey];
    let dailyProfit = 0;

    daysPicks.forEach((pick) => {
      if (pick.status === "WON") {
        dailyProfit += calculatePotentialProfit(
          pick.stake,
          pick.odds,
          pick.bonus ?? 0
        );
      } else if (pick.status === "LOST") {
        dailyProfit -= pick.stake;
      }
    });

    // Update global bankroll
    currentBank += dailyProfit;

    // Push ONE point per day (End of Day Balance)
    data.push({
      date: dateKey,
      balance: Number(currentBank.toFixed(2)),
    });
  });

  return data;
}
