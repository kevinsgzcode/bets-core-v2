"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";
import { calculatePotentialProfit } from "@/lib/utils/odds";

export async function createTransaction(type: TransactionType, amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  //no negative numbers
  if (amount <= 0) return { error: "Amount must be greater than 0" };

  try {
    if (type === "WITHDRAWAL") {
      const userId = session.user.id;

      const [transactions, picks] = await prisma.$transaction([
        prisma.transaction.findMany({ where: { userId } }),
        prisma.pick.findMany({ where: { userId } }),
      ]);

      const totalDeposits = transactions
        .filter((t) => t.type === "DEPOSIT")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = transactions
        .filter((t) => t.type === "WITHDRAWAL")
        .reduce((sum, t) => sum + t.amount, 0);

      let totalWagered = 0;
      let totalReturned = 0;

      picks.forEach((pick) => {
        totalWagered += pick.stake;
        if (pick.status === "WON") {
          const profit = calculatePotentialProfit(pick.stake, pick.odds);
          totalReturned += pick.stake + profit;
        } else if (pick.status === "PUSH") {
          totalReturned += pick.stake;
        }
      });

      // total bank
      const currentBank =
        totalDeposits - totalWithdrawals + (totalReturned - totalWagered);

      if (amount > currentBank) {
        return {
          error: `Insufficient funds. Available to withdraw: $${currentBank.toFixed(
            2
          )}`,
        };
      }
    }

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: type,
        amount: amount,
        description: type === "DEPOSIT" ? "Deposit Funds" : "Withdrawal",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Transaction error:", error);
    return { error: "Failed to process transaction" };
  }
}
