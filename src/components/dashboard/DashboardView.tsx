"use client";

import { useState, useMemo } from "react";
import { CreatePickModal } from "@/components/picks/CreatePickModal";
import { columns } from "@/components/picks/table/columns";
import { DataTable } from "@/components/picks/table/data-table";
import { BankrollChart } from "@/components/dashboard/BankrollChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WalletModal } from "@/components/dashboard/WalletModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { StoreInitializer } from "@/components/dashboard/StoreInitializer";
import { generateBankrollTrend } from "@/lib/utils/charts";
import { handleSignOut } from "@/actions/auth";
import { BestPerformingSport } from "@/components/insights/BestPerformingSport";
import { StreakInsight } from "@/components/insights/StreakInsight";
import type { StreakInsight as StreakInsightType } from "@/lib/insights/streak";

interface DashboardViewProps {
  user: any;
  session: any;
  picks: any[];
  runStats: any | null;
  lifetimeStats: any;
  insights: {
    bestSport: {
      run: any | null;
      lifetime: any | null;
    };
    streak: {
      run: StreakInsightType | null;
      lifetime: StreakInsightType | null;
    };
  };
}

export function DashboardView({
  user,
  session,
  picks,
  runStats,
  lifetimeStats,
  insights,
}: DashboardViewProps) {
  const [view, setView] = useState<"ALL" | "CYCLE">("CYCLE");

  // If there is no active run, fallback to lifetime context
  const effectiveBankroll = runStats ? runStats.availableBankroll : 0;

  const displayedChartData = useMemo(() => {
    if (!runStats) {
      return [];
    }

    if (view === "ALL") {
      return generateBankrollTrend(picks, lifetimeStats.netInvested);
    }

    const runPicks = picks.filter((p) => p.runId === runStats.id);

    return generateBankrollTrend(runPicks, runStats.initialBank);
  }, [view, runStats, picks, lifetimeStats.netInvested]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreInitializer
        currency={user?.currency ?? "MXN"}
        oddsFormat={user?.preferredOdds ?? "DECIMAL"}
      />

      {!user?.hasOnboarded && <OnboardingModal />}

      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <span className="text-xl font-bold text-indigo-600">Bets Core</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {session.user.email}
              </span>
              <button
                onClick={() => handleSignOut()}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>

            <div className="flex gap-3">
              <WalletModal runStats={runStats} />

              <CreatePickModal
                buttonLabel="Add New Pick"
                currentBank={effectiveBankroll}
              />
            </div>
          </div>

          <StatsCards
            runStats={runStats}
            lifetimeStats={lifetimeStats}
            view={view}
            onViewChange={setView}
          />

          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2">
              <BankrollChart data={displayedChartData} />
            </div>

            {/* Insights Panel */}
            <div className="grid grid-rows-2 gap-6">
              <BestPerformingSport
                view={view}
                data={
                  view === "CYCLE"
                    ? insights?.bestSport?.run ?? null
                    : insights?.bestSport?.lifetime ?? null
                }
              />
              {/*streals*/}
              <StreakInsight
                view={view}
                data={
                  view === "CYCLE"
                    ? insights.streak.run
                    : insights.streak.lifetime
                }
              />
            </div>
          </div>

          <DataTable columns={columns} data={picks} />
        </div>
      </main>
    </div>
  );
}
