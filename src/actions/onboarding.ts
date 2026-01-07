"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const initialBankroll = Number(formData.get("initialBankroll"));
  const currency = formData.get("currency") as "USD" | "MXN";
  const oddsFormat = formData.get("oddsFormat") as "AMERICAN" | "DECIMAL";

  if (!initialBankroll || initialBankroll <= 0) {
    return { error: "Invalid bankroll amount" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update user preferences
      await tx.user.update({
        where: { id: userId },
        data: {
          hasOnboarded: true,
          currency,
          preferredOdds: oddsFormat,
        },
      });

      // Create initial run
      const run = await tx.run.create({
        data: {
          userId,
          startedAt: new Date(),
          isActive: true,
        },
      });

      // Create initial deposit
      await tx.transaction.create({
        data: {
          userId,
          runId: run.id,
          type: "DEPOSIT",
          amount: initialBankroll,
          description: "Initial bankroll deposit",
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Failed to complete onboarding" };
  }
}
