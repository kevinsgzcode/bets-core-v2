import { Pick } from "@prisma/client";
import { calculatePotentialProfit } from "../utils/odds";

const MIN_BETS = 5;

export interface BestSportInsight {
  sport: string;
  profit: number;
  winRate: number;
  totalBets: number;
}

export function calculateBestPerformingSport(
  picks: Pick[]
): BestSportInsight | null {
  //filter settled bets
  const settledPicks = picks.filter(
    (p) => p.status === "WON" || p.status === "LOST" || p.status === "PUSH"
  );

  if (settledPicks.length < MIN_BETS) {
    return null;
  }

  //group by sport
  const statsBySport: Record<
    string,
    {
      profit: number;
      wins: number;
      bets: number;
      wagered: number;
    }
  > = {};

  for (const pick of settledPicks) {
    const sport = pick.sport;

    if (!statsBySport[sport]) {
      statsBySport[sport] = {
        profit: 0,
        wins: 0,
        bets: 0,
        wagered: 0,
      };
    }
    statsBySport[sport].bets++;
    statsBySport[sport].wagered += pick.stake;

    if (pick.status === "WON") {
      const bonus = (pick as any).bonus || 0;
      const profit = calculatePotentialProfit(pick.stake, pick.odds, bonus);

      statsBySport[sport].profit += profit;
      statsBySport[sport].wins++;
    }

    if (pick.status === "LOST") {
      statsBySport[sport].profit -= pick.stake;
    }
    //push no profit change
  }
  //conver to array
  const candidates = Object.entries(statsBySport)
    .map(([sport, data]) => {
      const winRate = data.bets > 0 ? (data.wins / data.bets) * 100 : 0;
      const roi = data.wagered > 0 ? (data.profit / data.wagered) * 100 : 0;

      return {
        sport,
        profit: data.profit,
        winRate,
        roi,
        totalBets: data.bets,
      };
    })
    .filter((s) => s.totalBets >= MIN_BETS);

  if (candidates.length === 0) {
    return null;
  }
  //sort by importance
  candidates.sort((a, b) => {
    if (b.profit !== a.profit) return b.profit - a.profit;
    if (b.roi !== a.roi) return b.roi - a.roi;
    return b.winRate - a.winRate;
  });

  //return best one
  const best = candidates[0];

  return {
    sport: best.sport,
    profit: Number(best.profit.toFixed(2)),
    winRate: Number(best.winRate.toFixed(2)),
    totalBets: best.totalBets,
  };
}
