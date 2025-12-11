"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pick } from "@prisma/client"; // Auto-generated type from DB
import { format } from "date-fns";
import { NFL_TEAMS } from "@/lib/constants";
import { calculatePotentialProfit } from "@/lib/utils/odds";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OddsCell } from "./OddsCell";
import { PickActions } from "./PickActions";

// Helper: Convert "arizona-cardinals" -> "ARI" (Abbreviation saves space)
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

export const columns: ColumnDef<Pick>[] = [
  //  DATE COLUMN
  {
    accessorKey: "matchDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-slate-600">
        {format(new Date(row.getValue("matchDate")), "MMM dd")}
      </div>
    ),
  },

  //  League / Sport
  {
    accessorKey: "sport",
    header: "Sport",
    cell: ({ row }) => {
      const pick = row.original;
      // If it's NFL smart pick, show "NFL". If manual, show the sport selected
      const display = pick.isManual ? pick.sport : pick.league || pick.sport;
      return (
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
          {display}
        </span>
      );
    },
  },

  // MATCHUP smart logic applied here
  {
    id: "matchup",
    header: "Matchup / Event",
    cell: ({ row }) => {
      const pick = row.original;

      if (pick.isManual) {
        return (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {pick.eventDescription || "Custon Evenet"}
            </span>
          </div>
        );
      }
      //smart mode
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
        <span className="font-medium text-blue-600 text-xs">{displayName}</span>
      );
    },
  },

  //  ODDS (Formatted)
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

  //  CALCULATED PROFIT
  {
    id: "profit",
    header: "Est. Profit",
    cell: ({ row }) => {
      const pick = row.original;
      const profit = calculatePotentialProfit(pick.stake, pick.odds);
      return (
        <div
          className={`font-bold ${
            profit > 0 ? "text-green-600" : "text-slate-400"
          }`}
        >
          ${profit.toFixed(2)}
        </div>
      );
    },
  },

  // STATUS
  {
    accessorKey: "status",
    header: "Result",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const colors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        WON: "bg-green-100 text-green-800 border-green-200",
        LOST: "bg-red-100 text-red-800 border-red-200",
        PUSH: "bg-gray-100 text-gray-800 border-gray-200",
      };

      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
            colors[status] || "bg-gray-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  //ACTIONS COLUMN
  {
    id: "actions",
    cell: ({ row }) => {
      const pick = row.original;
      return <PickActions pick={pick} />;
    },
  },
];
