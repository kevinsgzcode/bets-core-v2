import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserPicks() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const picks = await prisma.pick.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return picks;
  } catch (error) {
    console.error("failed to fetch picks", error);
    return [];
  }
}

export async function getUserTransactions() {
  const session = await auth();

  if (!session?.user?.id) return [];

  try {
    const transaction = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return transaction;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    return [];
  }
}
