import { Pick, Transaction } from "@prisma/client";
import { calculatePotentialProfit } from "./odds";

/* =======================
   RUN STATS (ACTIVE RUN)
======================= */

export interface RunStats {
  // Performance (Equity)
  initialBank: number; // First deposit of the run
  equity: number; // initialBank + profit
  profit: number;
  roi: number;

  // Liquidity
  availableBankroll: number;
  pendingStake: number;

  // Meta
  totalBets: number;
  winRate: number;
  turnover: number;
  isProfit: boolean;
}

export function calculateRunStats(
  picks: Pick[],
  transactions: Transaction[]
): RunStats {
  /* -----------------------
     TRANSACTIONS (RUN)
  ------------------------ */

  const deposits = transactions.filter((t) => t.type === "DEPOSIT");
  const withdrawals = transactions.filter((t) => t.type === "WITHDRAWAL");

  // First deposit defines the run starting point
  const initialBank =
    deposits.length > 0
      ? deposits.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0].amount
      : 0;

  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

  /* -----------------------
     PICKS (RUN)
  ------------------------ */

  let wagered = 0;
  let returned = 0;
  let wins = 0;
  let settled = 0;
  let pendingStake = 0;

  picks.forEach((pick) => {
    if (pick.status === "PENDING") {
      pendingStake += pick.stake;
      return;
    }

    // From here, bet IS settled
    wagered += pick.stake;
    settled++;

    if (pick.status === "WON") {
      const bonus = (pick as any).bonus || 0;
      returned +=
        pick.stake + calculatePotentialProfit(pick.stake, pick.odds, bonus);
      wins++;
    }

    if (pick.status === "PUSH") {
      returned += pick.stake;
    }

    // LOST → nothing returned
  });

  /* -----------------------
     PERFORMANCE (EQUITY)
  ------------------------ */

  const profit = returned - wagered;
  const equity = initialBank + profit;
  const roi = wagered > 0 ? (profit / wagered) * 100 : 0;
  const winRate = settled > 0 ? (wins / settled) * 100 : 0;

  /* -----------------------
     LIQUIDITY
  ------------------------ */

  const availableBankroll = Math.max(
    0,
    totalDeposits - totalWithdrawals - pendingStake
  );

  return {
    initialBank,
    equity,
    profit,
    roi,
    availableBankroll,
    pendingStake,

    totalBets: picks.length,
    winRate,
    turnover: wagered,
    isProfit: profit >= 0,
  };
}

/* =======================
   LIFETIME STATS
======================= */

export interface LifetimeStats {
  totalDeposits: number;
  totalWithdrawals: number;
  netInvested: number;

  netProfit: number;
  roi: number;
  totalBets: number;
  winRate: number;
  turnover: number;
}

export function calculateLifetimeStats(
  picks: Pick[],
  transactions: Transaction[]
): LifetimeStats {
  const totalDeposits = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "WITHDRAWAL")
    .reduce((sum, t) => sum + t.amount, 0);

  const netInvested = totalDeposits - totalWithdrawals;

  let wagered = 0; // ONLY settled bets
  let returned = 0;
  let wins = 0;
  let settled = 0;

  picks.forEach((pick) => {
    if (pick.status === "PENDING") return;

    wagered += pick.stake;
    settled++;

    if (pick.status === "WON") {
      const bonus = (pick as any).bonus || 0;
      returned +=
        pick.stake + calculatePotentialProfit(pick.stake, pick.odds, bonus);
      wins++;
    }

    if (pick.status === "PUSH") {
      returned += pick.stake;
    }
  });

  const netProfit = returned - wagered;
  const roi = wagered > 0 ? (netProfit / wagered) * 100 : 0;
  const winRate = settled > 0 ? (wins / settled) * 100 : 0;

  return {
    totalDeposits,
    totalWithdrawals,
    netInvested,
    netProfit,
    roi,
    totalBets: picks.length,
    winRate,
    turnover: wagered,
  };
}
