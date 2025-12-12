"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pick } from "@prisma/client";
import { format, addMinutes } from "date-fns"; // Added addMinutes for UTC fix
import { NFL_TEAMS } from "@/lib/constants";
import { calculatePotentialProfit } from "@/lib/utils/odds";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OddsCell } from "./OddsCell";
import { PickActions } from "./PickActions";

// Helper: Convert "arizona-cardinals" -> "ARI"
const getTeamAbbr = (id: string | null) => {
  if (!id) return "?";
  const team = NFL_TEAMS.find((t) => t.value === id);
  return team ? team.abbr : id.substring(0, 3).toUpperCase();
};

// Helper: Convert "arizona-cardinals" -> "Arizona Cardinals"
const getTeamName = (id: string | null) => {
  if (!id) return "?";
  const team = NFL_TEAMS.find((t) => t.value === id);
  return team ? team.label : id;
};

// Helper: Fix timezone offset for display
const formatUTCDate = (dateString: Date) => {
  const date = new Date(dateString);
  // This simple hack adds the timezone offset to force the date to display as entered
  // Note: For a robust SaaS, consider saving user timezone in DB. For MVP, this works.
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
};

export const columns: ColumnDef<Pick>[] = [
  //  DATE COLUMN (Fixed Timezone)
  {
    accessorKey: "matchDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Use the helper to correct the date visually
      const fixedDate = formatUTCDate(row.getValue("matchDate"));
      return (
        <div className="font-medium text-slate-600">
          {format(fixedDate, "MMM dd")}
        </div>
      );
    },
  },

  //  League / Sport
  {
    accessorKey: "sport",
    header: "Sport",
    cell: ({ row }) => {
      const pick = row.original;
      const display = pick.isManual ? pick.sport : pick.league || pick.sport;
      return (
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {display}
        </span>
      );
    },
  },

  // MATCHUP
  {
    id: "matchup",
    header: "Matchup / Event",
    cell: ({ row }) => {
      const pick = row.original;

      if (pick.isManual) {
        return (
          <div className="flex flex-col max-w-[180px]">
            <span
              className="text-sm font-semibold text-slate-900 truncate"
              title={pick.eventDescription || ""}
            >
              {pick.eventDescription || "Custom Event"}
            </span>
          </div>
        );
      }
      // Smart Mode
      const home = getTeamAbbr(pick.homeTeam);
      const away = getTeamAbbr(pick.awayTeam);
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">
            {away} @ {home}
          </span>
        </div>
      );
    },
  },

  // PICK SELECTION
  {
    accessorKey: "selection",
    header: "Pick",
    cell: ({ row }) => {
      const pick = row.original;
      const rawSelection = pick.selection;
      const displayName = pick.isManual
        ? rawSelection
        : getTeamName(rawSelection);

      return (
        <span
          className="font-medium text-blue-600 text-xs truncate max-w-[150px] block"
          title={displayName || ""}
        >
          {displayName}
        </span>
      );
    },
  },

  //  ODDS
  {
    accessorKey: "odds",
    header: "Odds",
    cell: ({ row }) => {
      const val = parseFloat(row.getValue("odds"));
      return <OddsCell decimalValue={val} />;
    },
  },

  //  STAKE
  {
    accessorKey: "stake",
    header: "Stake",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("stake"));
      return (
        <div className="font-medium text-slate-700">${amount.toFixed(2)}</div>
      );
    },
  },

  //  REAL P/L (PROFIT / LOSS) [MAJOR UPDATE]
  {
    id: "profit",
    header: "P/L",
    cell: ({ row }) => {
      const pick = row.original;
      const potentialProfit = calculatePotentialProfit(pick.stake, pick.odds);
      const status = pick.status;

      // 1. WON: Show Green Profit
      if (status === "WON") {
        return (
          <div className="font-bold text-green-600">
            +${potentialProfit.toFixed(2)}
          </div>
        );
      }

      // 2. LOST: Show Red Loss (The Stake)
      if (status === "LOST") {
        return (
          <div className="font-bold text-red-500">
            -${pick.stake.toFixed(2)}
          </div>
        );
      }

      // 3. PENDING: Show Potential in Gray (Neutral)
      if (status === "PENDING") {
        return (
          <div className="text-xs text-slate-400">
            (Pot: ${potentialProfit.toFixed(2)})
          </div>
        );
      }

      // 4. PUSH/VOID
      return <div className="font-bold text-slate-500">$0.00</div>;
    },
  },

  // STATUS
  {
    accessorKey: "status",
    header: "Result",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const colors: Record<string, string> = {
        PENDING: "bg-slate-100 text-slate-600 border-slate-200",
        WON: "bg-green-100 text-green-700 border-green-200",
        LOST: "bg-red-50 text-red-700 border-red-100",
        PUSH: "bg-orange-50 text-orange-700 border-orange-100",
      };

      return (
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
            colors[status] || "bg-gray-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },

  // ACTIONS
  {
    id: "actions",
    cell: ({ row }) => {
      const pick = row.original;
      return <PickActions pick={pick} />;
    },
  },
];
