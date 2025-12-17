"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPickSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { PickStatus } from "@prisma/client";
import { calculatePotentialProfit } from "@/lib/utils/odds";

export async function createPick(prevState: any, formData: FormData) {
  //  Check Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to add a pick." };
  }

  const mode = formData.get("mode");
  //construct an object matching our Zod schema structure
  const rawData: any = {
    mode: mode,
    matchDate: formData.get("matchDate"),
    sport: formData.get("sport"),
    odds: formData.get("odds"),
    stake: formData.get("stake"),
    bonus: formData.get("bonus"),
    selection: formData.get("selection"),
  };

  if (mode === "SMART") {
    rawData.homeTeam = formData.get("homeTeam");
    rawData.awayTeam = formData.get("awayTeam");
    rawData.league = "NFL";
  } else {
    rawData.eventDescription = formData.get("eventDescription");
  }

  const validateFields = createPickSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      error: "Validation fields",
      fieldError: validateFields.error.flatten().fieldErrors,
    };
  }

  const data = validateFields.data;

  try {
    //check if uses have money

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

    picks.forEach((p) => {
      totalWagered += p.stake;
      if (p.status === "WON") {
        const profit = calculatePotentialProfit(p.stake, p.odds, p.bonus);
        const historicalBonus = (p as any).bonus || 0;
        totalReturned += p.stake + profit + historicalBonus;
      } else if (p.status === "PUSH") {
        totalReturned += p.stake;
      }
    });

    const currentBank =
      totalDeposits - totalWithdrawals + (totalReturned - totalWagered);

    if (data.stake > currentBank) {
      return {
        error: `Insufficient funds. You only have $${currentBank.toFixed(
          2
        )} available.`,
      };
    }

    await prisma.pick.create({
      data: {
        userId,
        matchDate: new Date(data.matchDate),
        sport: data.sport,
        stake: data.stake,
        bonus: data.bonus || 0,
        odds: data.odds,
        selection: data.selection,
        status: "PENDING",
        isParlay: data.isParlay,
        legs: data.isParlay ? data.legs : 1,
        composition: data.isParlay ? data.composition : "SINGLE",

        isManual: data.mode === "MANUAL",
        eventDescription: data.mode === "MANUAL" ? data.eventDescription : null,

        homeTeam: data.mode === "SMART" ? data.homeTeam : null,
        awayTeam: data.mode === "SMART" ? data.awayTeam : null,
        league: data.mode === "SMART" ? data.league : "CUSTOM",
      },
    });

    revalidatePath("/");
    return { success: true, message: "Pick added successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to save pick. Please try again." };
  }
}

//Update status
export async function updatePickStatus(pickId: string, newStatus: PickStatus) {
  const session = await auth();

  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.pick.update({
      where: {
        id: pickId,
        userId: session.user.id,
      },
      data: {
        status: newStatus,
      },
    });
    //update dashboard
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update pick" };
  }
}

// delete pick
export async function deletePick(pickId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.pick.delete({
      where: {
        id: pickId,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete pick" };
  }
}
