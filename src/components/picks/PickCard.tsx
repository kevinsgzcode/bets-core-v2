import { format } from "date-fns";
import { Pick } from "@prisma/client";
import { calculatePotentialProfit } from "@/lib/utils/odds";

interface PickCardProps {
  pick: Pick;
}

export function PickCard({ pick }: PickCardProps) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    WON: "bg-green-100 text-green-800 border-green-200",
    LOST: "bg-red-100 text-red-800 border-red-200",
    PUSH: "bg-gray-100 text-gray-800 border-gray-200",
    MANUAL_REVIEW: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const potentialProfit = calculatePotentialProfit(pick.stake, pick.odds);
  const totalPayout = pick.stake + potentialProfit;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {pick.sport} • {format(new Date(pick.matchDate), "MMM d, yyyy")}
        </span>

        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            statusColors[pick.status]
          }`}
        >
          {pick.status}
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Event</p>
        <p className="text-lg font-semibold text-gray-900">
          {pick.eventDescription}
        </p>
      </div>

      {/* SELECTION */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">Your Pick</div>
        <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100 inline-block">
          <span className="font-semibold text-blue-700">{pick.selection}</span>
          <span className="ml-2 text-xs font-mono text-slate-500">
            ({pick.odds.toFixed(2)})
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Stake</p>
          <p className="font-medium text-gray-900">${pick.stake.toFixed(2)}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Potential Payout</p>
          <p className="font-bold text-green-600 text-lg">
            ${totalPayout.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
