import { CreatePickModal } from "@/components/picks/CreatePickModal";
import { columns } from "@/components/picks/table/columns";
import { DataTable } from "@/components/picks/table/data-table";
import { BankrollChart } from "@/components/dashboard/BankrollChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WalletModal } from "@/components/dashboard/WalletModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { StoreInitializer } from "@/components/dashboard/StoreInitializer";
import { signOut } from "@/auth";

// Define the interface for the props needed
interface DashboardViewProps {
  // Ideally strictly typed with Prisma generated types
  user: any;
  session: any;
  picks: any[];
  stats: any;
}

export function DashboardView({
  user,
  session,
  picks,
  stats,
}: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Global Preference Injection */}
      <StoreInitializer
        currency={user?.currency ?? "MXN"}
        oddsFormat={user?.preferredOdds ?? "DECIMAL"}
      />

      {/* 2. Onboarding Check */}
      {!user?.hasOnboarded && <OnboardingModal />}

      {/* 3. Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-blue-600">
                  Bets Core
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {session.user.email}
              </span>
              {/* Server Action for Logout */}
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Main Dashboard Content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Dashboard
              </h2>
            </div>
            <div className="mt-4 flex items-center gap-3 md:ml-4 md:mt-0">
              <WalletModal />
              <CreatePickModal
                buttonLabel="Add New Pick"
                currentBank={stats.currentBank}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts */}
          <div className="mb-8">
            <BankrollChart picks={picks} />
          </div>

          {/* History Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">History</h3>
            </div>
            <DataTable columns={columns} data={picks} />
          </div>
        </div>
      </main>
    </div>
  );
}
