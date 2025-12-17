import { Pick, Transaction } from "@prisma/client";
import { calculatePotentialProfit } from "./odds";

export interface DashboardStats {
  currentBank: number;
  netProfit: number;
  roi: number;
  totalBets: number;
  winRate: number;
  turnover: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export function calculateStats(
  picks: Pick[],
  transactions: Transaction[]
): DashboardStats {
  //calculate external money
  const totalDeposits = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "WITHDRAWAL")
    .reduce((sum, t) => sum + t.amount, 0);

  //calculate betting performance
  //turnover
  let totalWagered = 0;
  //payouts
  let totalReturned = 0;
  let wins = 0;
  let settleBets = 0;

  picks.forEach((pick) => {
    const bonus = (pick as any).bonus || 0;
    //every pick reduce banke
    totalWagered += pick.stake;

    if (pick.status === "WON") {
      const profit = calculatePotentialProfit(pick.stake, pick.odds, bonus);
      const payout = pick.stake + profit;
      totalReturned += payout;

      wins++;
      settleBets++;
    } else if (pick.status === "LOST") {
      //returned is 0
      settleBets++;
    } else if (pick.status === "PUSH") {
      totalReturned += pick.stake;
      settleBets++;
    }
  });
  // Bankroll = (Money In - Money Out) + (Money Won - Money Bet)
  const currentBank =
    totalDeposits - totalWithdrawals + (totalReturned - totalWagered);

  //calculate Profit based on SETTLED bets to show performance

  const settledWagered = picks
    .filter((p) => ["WON", "LOST", "PUSH"].includes(p.status))
    .reduce((sum, p) => sum + p.stake, 0);

  const settleReturned = picks
    .filter((p) => ["WON", "LOST", "PUSH"].includes(p.status))
    .reduce((sum, p) => {
      const bonus = (p as any).bonus || 0;
      if (p.status === "WON")
        return sum + p.stake + calculatePotentialProfit(p.stake, p.odds, bonus);
      if (p.status === "PUSH") return sum + p.stake;
      return sum;
    }, 0);

  const netProfit = settleReturned - settledWagered;
  // ROI = (Net Profit / Turnover) * 100
  const roi = settledWagered > 0 ? (netProfit / settledWagered) * 100 : 0;
  const winRate = settleBets > 0 ? (wins / settleBets) * 100 : 0;

  return {
    currentBank,
    netProfit,
    roi,
    totalBets: picks.length,
    winRate,
    turnover: totalWagered,
    totalDeposits,
    totalWithdrawals,
  };
}
