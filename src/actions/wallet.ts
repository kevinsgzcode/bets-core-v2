"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";

export async function createTransaction(type: TransactionType, amount: number) {
  //  Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  //  Basic validation
  if (amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  const userId = session.user.id;

  try {
    // Get active Run (if any)
    let activeRun = await prisma.run.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    /**
     * DEPOSIT FLOW
     * - If there is no active run, create one
     * - Always create a DEPOSIT transaction
     */
    if (type === "DEPOSIT") {
      if (!activeRun) {
        activeRun = await prisma.run.create({
          data: {
            userId,
            isActive: true,
          },
        });
      }

      await prisma.transaction.create({
        data: {
          userId,
          runId: activeRun.id,
          type: "DEPOSIT",
          amount,
        },
      });
    }

    //WITHDRAWAL FLOW

    if (type === "WITHDRAWAL") {
      if (!activeRun) {
        return {
          error: "No active bankroll. You must have an active run to withdraw.",
        };
      }

      // Create withdrawal transaction
      await prisma.transaction.create({
        data: {
          userId,
          runId: activeRun.id,
          type: "WITHDRAWAL",
          amount,
        },
      });

      // Close the run
      await prisma.run.update({
        where: { id: activeRun.id },
        data: {
          isActive: false,
          endedAt: new Date(),
        },
      });
    }

    // Revalidate UI
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Transaction error:", error);
    return { error: "Failed to process transaction" };
  }
}
