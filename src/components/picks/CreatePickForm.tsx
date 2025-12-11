"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Bot, Pencil } from "lucide-react";
import { toast } from "sonner";

interface CreatePickFormProps {
  onSuccess: () => void;
  currentBank: number;
}

const SPORTS_LIST = [
  "NFL",
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
}: CreatePickFormProps) {
  // 1. Get Global Preference
  const { oddsFormat } = useSettingsStore();

  // const [mode, setMode] = useState<"SMART" | "MANUAL">("SMART") // <-- OLD
  const [mode, setMode] = useState<"SMART" | "MANUAL">("MANUAL"); // <-- NEW (MVP Locked)

  // [CORRECTION] Initialize state based on the global store, not hardcoded 'true'
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
      homeTeam: "",
      awayTeam: "",
      league: "NFL",
      selection: "",
      eventDescription: "",
    },
  });

  const stake = form.watch("stake");
  const odds = form.watch("odds");
  const homeTeamName = form.watch("homeTeam");
  const awayTeamName = form.watch("awayTeam");

  const potentialProfit = calculatePotentialProfit(
    Number(stake || 0),
    Number(odds || 1)
  );

  // [CORRECTION] Sync local state if global store changes (e.g. initial load or toggle elsewhere)
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

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await createPick(null, formData);

    setIsSubmitting(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Pick created successfully!");
      form.reset();
      onSuccess();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* VISUAL INDICATOR FOR MVP */}
        <div className="bg-slate-100 p-2 rounded-md text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Play responsibly and enjoy the game!
        </div>

        {/* UNIVERSAL ROW */}
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
                <FormLabel>Sport</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={false}
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DYNAMIC BODY */}
        {mode === "SMART" ? (
          /* --- SMART MODE (HIDDEN FOR NOW) --- */
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Away Team</FormLabel>
                    <FormControl>
                      <TeamCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <FormControl>
                      <TeamCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="selection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pick Selection</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        field.value === awayTeamName && field.value !== ""
                          ? "default"
                          : "outline"
                      }
                      className="flex-1"
                      onClick={() => field.onChange(awayTeamName)}
                      disabled={!awayTeamName}
                    >
                      {awayTeamName || "Select Away Team"}
                    </Button>
                    <Button
                      type="button"
                      variant={
                        field.value === homeTeamName && field.value !== ""
                          ? "default"
                          : "outline"
                      }
                      className="flex-1"
                      onClick={() => field.onChange(homeTeamName)}
                      disabled={!homeTeamName}
                    >
                      {homeTeamName || "Select Home Team"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          /* --- MANUAL MODE (ALWAYS VISIBLE FOR MVP) --- */
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Nadal vs Djokovic - Final"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Describe the match or event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Pick</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nadal to win 1st Set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* FINANCIAL SECTION */}
        <div className="pt-2 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4">
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
                      placeholder={isAmericanOdds ? "-110" : "1.90"}
                      value={displayOdds}
                      onChange={(e) => {
                        let rawValue = e.target.value;
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 p-3 bg-slate-900 text-white rounded-md flex justify-between items-center">
            <div className="text-xs text-slate-400">
              Total Payout:{" "}
              <span className="text-white font-bold ml-1">
                ${(Number(stake) + potentialProfit).toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Net Profit</div>
              <div className="text-lg font-bold text-green-400">
                +${potentialProfit.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Pick
          </Button>
        </div>
      </form>
    </Form>
  );
}
