export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserPicks, getUserTransactions } from "@/lib/data";

import { calculateRunStats, calculateLifetimeStats } from "@/lib/utils/stats";

import { calculateBestPerformingSport } from "@/lib/insights/bestSport";
import { calculateStreakInsight } from "@/lib/insights/streak";

// Views
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function Home() {
  // AUTH

  const session = await auth();

  if (!session?.user) {
    return <LandingPage />;
  }

  const userId = session.user.id;

  // USER SETTINGS

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasOnboarded: true,
      currency: true,
      preferredOdds: true,
    },
  });

  if (!user) {
    //prevents hard crashes
    return <LandingPage />;
  }

  // --------------------
  // CORE DATA
  // --------------------
  const [picks, transactions] = await Promise.all([
    getUserPicks(),
    getUserTransactions(),
  ]);

  // --------------------
  // ACTIVE RUN
  // --------------------
  const activeRun = await prisma.run.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });

  // --------------------
  // RUN STATS + INSIGHTS
  // --------------------
  let runStats = null;
  let runBestSport = null;
  let runStreak = null;

  if (activeRun) {
    const runPicks = picks.filter((p) => p.runId === activeRun.id);

    const runTransactions = transactions.filter(
      (t) => t.runId === activeRun.id
    );

    runStats = calculateRunStats(runPicks, runTransactions);
    runBestSport = calculateBestPerformingSport(runPicks);
    runStreak = calculateStreakInsight(runPicks);
  }

  // --------------------
  // LIFETIME STATS + INSIGHTS
  // --------------------
  const lifetimePicks = picks.filter((p) => p.runId !== null);
  const lifetimeTransactions = transactions.filter((t) => t.runId !== null);

  const lifetimeStats = calculateLifetimeStats(
    lifetimePicks,
    lifetimeTransactions
  );

  const lifetimeBestSport = calculateBestPerformingSport(lifetimePicks);
  const lifetimeStreak = calculateStreakInsight(lifetimePicks);

  // --------------------
  // RENDER DASHBOARD
  // --------------------
  return (
    <DashboardView
      user={user}
      session={session}
      picks={picks}
      runStats={runStats}
      lifetimeStats={lifetimeStats}
      insights={{
        bestSport: {
          run: runBestSport,
          lifetime: lifetimeBestSport,
        },
        streak: {
          run: runStreak,
          lifetime: lifetimeStreak,
        },
      }}
    />
  );
}
