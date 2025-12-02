import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  //get session form the server
  const session = await auth();

  //if no user is logged in, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

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
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-lg">
                Dashboard Metrics will appear here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
