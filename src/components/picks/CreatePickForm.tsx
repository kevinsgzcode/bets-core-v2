"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Asegúrate de que tu schema 'createPickSchema' en @/lib/zod ya tenga los campos de parlay
// Si no, actualízalo como vimos en el paso anterior.
import { createPickSchema, type CreatePickSchema } from "@/lib/zod";
import { createPick } from "@/actions/picks";
import {
  americanToDecimal,
  decimalToAmerican,
  calculatePotentialProfit,
} from "@/lib/utils/odds";
import { useSettingsStore } from "@/lib/store";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // No usado actualmente
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // [NEW] Needed for Toggle
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TeamCombobox } from "./TeamCombobox";
import { Loader2, Gift, Layers, Zap } from "lucide-react"; // [NEW] Added icons
import { toast } from "sonner";

interface CreatePickFormProps {
  onSuccess: () => void;
  currentBank: number;
  closeModal: () => void; // Added closeModal to props interface just in case
}

const SPORTS_LIST = [
  "NFL",
  "BASEBALL",
  "SOCCER",
  "NBA",
  "MLB",
  "F1",
  "TENNIS",
  "UFC",
  "OTHER",
];

export function CreatePickForm({
  onSuccess,
  currentBank,
  closeModal,
}: CreatePickFormProps) {
  // 1. Get Global Preference
  const { oddsFormat } = useSettingsStore();

  const [mode, setMode] = useState<"SMART" | "MANUAL">("MANUAL");

  // Initialize state based on the global store
  const [isAmericanOdds, setIsAmericanOdds] = useState(
    oddsFormat === "AMERICAN"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayOdds, setDisplayOdds] = useState<string>("-110");

  const form = useForm<CreatePickSchema>({
    resolver: zodResolver(createPickSchema),
    defaultValues: {
      mode: "MANUAL",
      sport: "NFL",
      matchDate: new Date().toISOString().split("T")[0],
      odds: 1.91,
      stake: 50,
      bonus: 0,
      homeTeam: "",
      awayTeam: "",
      league: "NFL",
      selection: "",
      eventDescription: "",
      isParlay: false,
      legs: 2,
      composition: "MIXED",
    },
  });

  // Watchers for calculations & conditional UI
  const stake = form.watch("stake");
  const odds = form.watch("odds");
  const bonus = form.watch("bonus");
  const homeTeamName = form.watch("homeTeam");
  const awayTeamName = form.watch("awayTeam");
  const isParlayMode = form.watch("isParlay"); // [NEW]

  // [UPDATED] Financial Calculations
  const baseProfit = calculatePotentialProfit(
    Number(stake || 0),
    Number(odds || 1)
  );
  const totalProfit = baseProfit + Number(bonus || 0);
  const totalPayout = Number(stake || 0) + totalProfit;

  // Sync local state if global store changes
  useEffect(() => {
    setIsAmericanOdds(oddsFormat === "AMERICAN");
  }, [oddsFormat]);

  // Effect to handle display format switching
  useEffect(() => {
    const currentDecimal = form.getValues("odds");
    if (isAmericanOdds) {
      setDisplayOdds(String(decimalToAmerican(currentDecimal)));
    } else {
      setDisplayOdds(String(currentDecimal));
    }
  }, [isAmericanOdds, form]);

  async function onSubmit(values: CreatePickSchema) {
    setIsSubmitting(true);
    const formData = new FormData();

    // Flatten values into FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle boolean conversion explicitly for FormData
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Server Action
    const result = await createPick(null, formData); // Modified to match your server action signature

    setIsSubmitting(false);
    if (result?.error) {
      toast.error(result.error); // Assuming result returns { error: string } on fail
    } else {
      toast.success(isParlayMode ? "Parlay created!" : "Pick created!");
      form.reset();
      onSuccess();
      if (closeModal) closeModal();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* VISUAL INDICATOR */}
        <div className="bg-slate-100 p-2 rounded-md text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Play responsibly and enjoy the game!
        </div>

        {/* [NEW] PARLAY TOGGLE SECTION */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-indigo-50/50 border-indigo-100">
          <div className="space-y-0.5">
            <FormLabel className="text-base font-semibold flex items-center gap-2 text-indigo-900">
              <Layers className="h-4 w-4" /> Parlay Mode
            </FormLabel>
            <p className="text-xs text-indigo-600/80">
              Activate for multi-picks bets (+2 selections)
            </p>
          </div>
          <FormField
            control={form.control}
            name="isParlay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* [NEW] PARLAY FIELDS (CONDITIONAL) */}
        {isParlayMode && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
            <FormField
              control={form.control}
              name="composition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-indigo-800">
                    Composition
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 bg-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MIXED">⚡ Mixed Sports</SelectItem>
                      <SelectItem value="SOCCER">⚽ Soccer Only</SelectItem>
                      <SelectItem value="NFL">🏈 NFL Only</SelectItem>
                      <SelectItem value="NBA">🏀 NBA Only</SelectItem>
                      <SelectItem value="MLB">⚾ MLB Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-indigo-800">
                    Picks
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2}
                      {...field}
                      className="h-9 bg-white"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* UNIVERSAL ROW (Date & Sport) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="matchDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isParlayMode ? "Primary Sport" : "Sport"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPORTS_LIST.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                    {isParlayMode && (
                      <SelectItem value="MIXED">Mixed</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DESCRIPTION ROW */}
        <div
          className={`space-y-4 p-4 rounded-lg border ${
            isParlayMode
              ? "bg-indigo-50 border-indigo-200"
              : "bg-blue-50 border-blue-100"
          }`}
        >
          <FormField
            control={form.control}
            name="eventDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isParlayMode ? "Parlay Summary / Note" : "Event Description"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      isParlayMode
                        ? "e.g. Sunday NFL Parlay + Chiefs"
                        : "e.g. Nadal vs Djokovic - Final"
                    }
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {isParlayMode
                    ? "Briefly describe the combo."
                    : "Describe the match or event."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pick Selection Field */}
          {/* If Parlay, we might hide this or use it for "Main Pick" if desired, but typically we just use Description. 
                For now, let's keep it but optional in logic if needed, or re-purpose. */}
          <FormField
            control={form.control}
            name="selection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isParlayMode ? "Key Pick / Focus" : "Your Pick"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      isParlayMode
                        ? "e.g. NFL Sunday games"
                        : "e.g. Nadal to win 1st Set"
                    }
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* FINANCIAL SECTION */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" /> Financials
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="odds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Odds ({isAmericanOdds ? "American" : "Decimal"})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={isAmericanOdds ? "+250" : "3.50"}
                      value={displayOdds}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (!isAmericanOdds && rawValue.includes("-")) return;

                        setDisplayOdds(rawValue);

                        if (rawValue === "" || rawValue === "-") return;
                        const parsedValue = Number(rawValue);
                        if (!isNaN(parsedValue)) {
                          if (isAmericanOdds) {
                            field.onChange(americanToDecimal(parsedValue));
                          } else {
                            field.onChange(parsedValue);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stake ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* BONUS FIELD */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="bonus"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <FormLabel className="m-0">
                      Casino Bonus (Optional)
                    </FormLabel>
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Gift className="h-3 w-3" /> Extra Cash
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-green-200 focus-visible:ring-green-500"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Add any parlay boost or promotion amount here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SUMMARY BOX */}
          <div className="mt-4 p-3 bg-slate-900 text-white rounded-md flex justify-between items-center shadow-lg transition-all duration-300">
            <div className="text-xs text-slate-400">
              Total Payout:{" "}
              <span className="text-white font-bold ml-1 text-lg">
                ${totalPayout.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Net Profit</div>
              <div className="text-xl font-bold text-green-400">
                +${totalProfit.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isParlayMode ? "Save Parlay" : "Save Pick"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
