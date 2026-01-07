"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPickSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { PickStatus } from "@prisma/client";
import { calculateRunStats } from "@/lib/utils/stats";

/**
 Creates a new Pick inside the active Run
 */
export async function createPick(prevState: any, formData: FormData) {
  // Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to add a pick." };
  }

  const userId = session.user.id;

  //  Build raw input (same as before)
  const mode = formData.get("mode");

  const rawData: any = {
    mode,
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

  // Zod validation
  const validation = createPickSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: "Invalid fields",
      fieldError: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;

  try {
    // Get active Run
    const activeRun = await prisma.run.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!activeRun) {
      return {
        error:
          "You must have an active bankroll before placing a bet. Please deposit funds first.",
      };
    }

    // REAL BANKROLL VALIDATION

    // Fetch all picks for the active run
    const runPicks = await prisma.pick.findMany({
      where: {
        runId: activeRun.id,
      },
    });

    // Fetch all transactions for the active run
    const runTransactions = await prisma.transaction.findMany({
      where: {
        runId: activeRun.id,
      },
    });

    // Reuse the same logic used in the dashboard
    const runStats = calculateRunStats(runPicks, runTransactions);

    // Available = equity - money currently in pending
    const pendingStake = runPicks
      .filter((p) => p.status === PickStatus.PENDING)
      .reduce((sum, p) => sum + p.stake, 0);

    const availableBankroll = Math.max(0, runStats.equity - pendingStake);

    if (data.stake > availableBankroll) {
      return {
        error: `Insufficient bankroll. Available: $${availableBankroll.toFixed(
          2
        )}`,
      };
    }

    //Create Pick inside the Run
    await prisma.pick.create({
      data: {
        userId,
        runId: activeRun.id,

        matchDate: new Date(data.matchDate),
        sport: data.sport,
        stake: data.stake,
        bonus: data.bonus ?? 0,
        odds: data.odds,
        selection: data.selection,
        status: PickStatus.PENDING,

        isParlay: data.isParlay,
        legs: data.isParlay ? data.legs : 1,
        composition: data.isParlay ? data.composition : "SINGLE",

        isManual: true,
        eventDescription: data.eventDescription,

        homeTeam: null,
        awayTeam: null,
        league: "CUSTOM",
      },
    });

    revalidatePath("/");
    return { success: true, message: "Pick added successfully!" };
  } catch (error) {
    console.error("Create Pick Error:", error);
    return { error: "Failed to save pick. Please try again." };
  }
}

//Delete pick only if it belongs to he active run
export async function deletePick(pickId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // Find the pick and its run
    const pick = await prisma.pick.findFirst({
      where: {
        id: pickId,
        userId,
      },
      include: {
        run: true,
      },
    });

    if (!pick) {
      return { error: "Pick not found" };
    }

    // Prevent deleting picks from closed runs
    if (!pick.run || !pick.run.isActive) {
      return {
        error: "You cannot delete picks from a closed run.",
      };
    }

    await prisma.pick.delete({
      where: {
        id: pickId,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete Pick Error:", error);
    return { error: "Failed to delete pick" };
  }
}

//update pick only if it belongs to the active run
export async function updatePickStatus(pickId: string, newStatus: PickStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const pick = await prisma.pick.findFirst({
      where: {
        id: pickId,
        userId,
      },
      include: {
        run: true,
      },
    });

    if (!pick) {
      return { error: "Pick not found" };
    }

    if (!pick.run || !pick.run.isActive) {
      return {
        error: "You cannot update picks from a closed run",
      };
    }

    const isFinalStatus =
      newStatus === PickStatus.WON ||
      newStatus === PickStatus.LOST ||
      newStatus === PickStatus.PUSH;

    const isSettlingNow = pick.status === PickStatus.PENDING && isFinalStatus;

    await prisma.pick.update({
      where: {
        id: pickId,
      },
      data: {
        status: newStatus,
        settledAt: isSettlingNow ? new Date() : pick.settledAt,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update pick status error:", error);
    return { error: "Failed to update pick status" };
  }
}
