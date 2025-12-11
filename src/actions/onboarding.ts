"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const initialBankroll = parseFloat(formData.get("initialBankroll") as string);
  const oddsFormat = formData.get("oddsFormat") as string;
  const currency = formData.get("currency") as string;

  if (isNaN(initialBankroll) || initialBankroll <= 0) {
    return { error: "Please enter a valid initial bankroll" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      //update user preferences
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          hasOnboarded: true,
          preferredOdds: oddsFormat,
          currency: currency,
        },
      });
      //Initial bank
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "DEPOSIT",
          amount: initialBankroll,
          description: "Initial Bank",
        },
      });
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Failed to setup account" };
  }
}
