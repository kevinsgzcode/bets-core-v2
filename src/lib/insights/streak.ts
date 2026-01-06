import { Pick, PickStatus } from "@prisma/client";

export type StreakInsight = {
  currentStreak: {
    type: "WIN" | "LOSS" | null;
    count: number;
  };
  bestWinStreak: number;
  worstLoseStreak: number;
};

export function calculateStreakInsight(picks: Pick[]): StreakInsight {
  if (!picks.length) {
    return {
      currentStreak: { type: null, count: 0 },
      bestWinStreak: 0,
      worstLoseStreak: 0,
    };
  }
  //Defensive sort
  const sortedPicks = picks
    .filter((p) => {
      if (!p.settledAt) return false;

      return (
        p.status === PickStatus.WON ||
        p.status === PickStatus.LOST ||
        p.status === PickStatus.PUSH
      );
    })
    .sort(
      (a, b) =>
        new Date(a.settledAt!).getTime() - new Date(b.settledAt!).getTime()
    );

  let currentWin = 0;
  let currentLoss = 0;
  let bestWin = 0;
  let worstLoss = 0;

  for (const pick of sortedPicks) {
    if (pick.status === PickStatus.PUSH) {
      currentWin = 0;
      currentLoss = 0;
      continue;
    }
    if (pick.status === PickStatus.WON) {
      currentWin += 1;
      currentLoss = 0;
      bestWin = Math.max(bestWin, currentWin);
    }
    if (pick.status === PickStatus.LOST) {
      currentLoss += 1;
      currentWin = 0;
      worstLoss = Math.max(worstLoss, currentLoss);
    }
  }

  let currentStreak: StreakInsight["currentStreak"] = {
    type: null,
    count: 0,
  };

  if (currentWin >= 2) {
    currentStreak = { type: "WIN", count: currentWin };
  } else if (currentLoss >= 2) {
    currentStreak = { type: "LOSS", count: currentLoss };
  }

  return {
    currentStreak,
    bestWinStreak: bestWin >= 2 ? bestWin : 0,
    worstLoseStreak: worstLoss >= 2 ? worstLoss : 0,
  };
}
