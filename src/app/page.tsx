import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { CreatePickModal } from "@/components/picks/CreatePickModal";
import { getUserPicks } from "@/lib/data";
import { columns } from "@/components/picks/table/columns";
import { DataTable } from "@/components/picks/table/data-table";
import { FormatToggle } from "@/components/picks/FormatToggle";
import { BankrollChart } from "@/components/dashboard/BankrollChart";
import { calculateStats } from "@/lib/utils/stats";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WalletModal } from "@/components/dashboard/WalletModal";
import { getUserTransactions } from "@/lib/data";

export default async function Home() {
  //get session form the server
  const session = await auth();

  //if no user is logged in, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }
  //fetch data
  const [picks, transactions] = await Promise.all([
    getUserPicks(),
    getUserTransactions(),
  ]);

  //calculate stats
  const stats = calculateStats(picks, transactions);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* navigation bar */}
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
                Welcome, {session.user.email}
              </span>
              {/* Logout */}
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
      {/*Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Dashboard
              </h2>
            </div>
            <div className="mt-4 flex items-center gap-3 md:ml-4 md:mt-0">
              <FormatToggle />
              <WalletModal />
              <CreatePickModal
                buttonLabel="Add New Pick"
                currentBank={stats.currentBank}
              />
            </div>
          </div>
          {/* Stats */}
          <StatsCards stats={stats} />
          {/*Graph section */}
          <div className="mb-8">
            <BankrollChart picks={picks} />
          </div>

          {/* Picks Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">History</h3>
            </div>

            {/* The Table Component handles rendering, sorting and pagination */}
            <DataTable columns={columns} data={picks} />
          </div>
        </div>
      </main>
    </div>
  );
}
