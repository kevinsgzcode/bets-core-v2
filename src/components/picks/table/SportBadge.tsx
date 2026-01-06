import {
  Trophy,
  Activity,
  Car,
  Target,
  Dribbble,
  Swords,
  Circle,
  Shuffle,
  HelpCircle,
  Disc,
} from "lucide-react";

const SPORT_CONFIG: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  NFL: {
    icon: Trophy,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    label: "NFL",
  },
  NBA: {
    icon: Disc,
    color: "bg-orange-50 text-orange-800 border-orange-200",
    label: "NBA",
  },
  SOCCER: {
    icon: Activity,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "SOC",
  },
  MLB: {
    icon: Target,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: "MLB",
  },
  BASEBALL: {
    icon: Target,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: "MLB",
  },
  F1: {
    icon: Car,
    color: "bg-red-100 text-red-700 border-red-200",
    label: "F1",
  },
  UFC: {
    icon: Swords,
    color: "bg-slate-200 text-slate-800 border-slate-300",
    label: "UFC",
  },
  TENNIS: {
    icon: Circle,
    color: "bg-lime-100 text-lime-700 border-lime-200",
    label: "TEN",
  },
  MIXED: {
    icon: Shuffle,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    label: "MIX",
  },
  OTHER: {
    icon: HelpCircle,
    color: "bg-gray-100 text-gray-600 border-gray-200",
    label: "OTH",
  },
};

export const SportBadge = ({ sport }: { sport: string }) => {
  const normalizedSport = sport?.toUpperCase() || "OTHER";

  const config = SPORT_CONFIG[normalizedSport] || SPORT_CONFIG["OTHER"];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center w-fit px-2 py-1 rounded-md border ${config.color}`}
    >
      <Icon className="w-3 h-3 mr-1.5" strokeWidth={2.5} />
      <span className="text-[10px] font-extrabold tracking-wider leading-none">
        {config.label}
      </span>
    </div>
  );
};
