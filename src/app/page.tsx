import { auth } from "@/auth";
import { getUserPicks, getUserTransactions } from "@/lib/data";
import { calculateStats } from "@/lib/utils/stats";
import { prisma } from "@/lib/prisma";
// Import the new views
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function Home() {
  // 1. Check Session Server-Side
  const session = await auth();

  // 2. IF NO SESSION -> Show Public Landing Page
  if (!session?.user) {
    return <LandingPage />;
  }

  // 3. IF SESSION EXISTS -> Fetch Data & Show Dashboard

  // A. Fetch user preferences (for the global store)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      hasOnboarded: true,
      currency: true,
      preferredOdds: true,
    },
  });

  // B. Fetch operational data
  const [picks, transactions] = await Promise.all([
    getUserPicks(),
    getUserTransactions(),
  ]);

  // C. Calculate financial stats
  const stats = calculateStats(picks, transactions);

  // D. Render the Authenticated Dashboard View
  return (
    <DashboardView user={user} session={session} picks={picks} stats={stats} />
  );
}
