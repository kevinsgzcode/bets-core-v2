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

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TeamCombobox } from "./TeamCombobox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreatePickFormProps {
  onSuccess: () => void;
}

export function CreatePickForm({ onSuccess }: CreatePickFormProps) {
  // Default state
  const [isAmericanOdds, setIsAmericanOdds] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayOdds, setDisplayOdds] = useState<string>("-100");

  //  Initialize Form
  const form = useForm<CreatePickSchema>({
    resolver: zodResolver(createPickSchema),
    defaultValues: {
      category: "NFL",
      league: "NFL",
      matchDate: new Date().toISOString().split("T")[0],
      homeTeam: "",
      awayTeam: "",
      selection: "",
      odds: 1.91,
      stake: 10,
    },
  });

  useEffect(() => {
    const currentDecimal = form.getValues("odds");
    if (isAmericanOdds) {
      setDisplayOdds(String(decimalToAmerican(currentDecimal)));
    } else {
      setDisplayOdds(String(currentDecimal));
    }
  }, [isAmericanOdds, form]);

  // Watch values for real-time calculation
  const stake = form.watch("stake");
  const odds = form.watch("odds");
  const homeTeamName = form.watch("homeTeam");
  const awayTeamName = form.watch("awayTeam");

  // Handle Odds Display Logic
  // keep 'odds' in decimal in the form state

  const potentialProfit = calculatePotentialProfit(
    Number(stake || 0),
    Number(odds || 1)
  );

  async function onSubmit(values: CreatePickSchema) {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append all values to FormData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const result = await createPick(null, formData);

    setIsSubmitting(false);
    if (result?.error) {
      // Simple alert for now
      alert(result.error);
    } else {
      alert("Pick created successfully!");
      form.reset();
      onSuccess();
    }
  }
  console.log(form.formState.errors);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Date & League */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="matchDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* League is hidden */}
          <div className="hidden">
            <input type="hidden" value="NFL" {...form.register("league")} />
          </div>
        </div>

        {/* Row 2: Teams (The Comboboxes) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="awayTeam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Away Team (Visit)</FormLabel>
                <FormControl>
                  <TeamCombobox value={field.value} onChange={field.onChange} />
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
                <FormLabel>Home Team (Local)</FormLabel>
                <FormControl>
                  <TeamCombobox value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Selection (Who wins?) */}
        <FormField
          control={form.control}
          name="selection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick Selection</FormLabel>
              <div className="flex gap-2">
                {/*AWAY */}
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
                  {awayTeamName || "Select Away Team first"}
                </Button>

                {/* HOME */}
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
                  {homeTeamName || "Select Home Team first"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 4: Odds & Stake */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Bet Details
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Decimal</span>
              <Switch
                checked={isAmericanOdds}
                onCheckedChange={setIsAmericanOdds}
              />
              <span className="text-xs font-bold text-slate-700">American</span>
            </div>
          </div>

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

                        if (!isAmericanOdds && rawValue.includes("-")) {
                          return; // Rechaza el cambio, no hace nada
                        }

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
                  <FormDescription>
                    Stored Decimal: {Number(field.value).toFixed(2)}
                  </FormDescription>
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

          {/* LIVE CALCULATOR */}
          <div className="pt-3 border-t border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs">Total Payout (Pago):</span>
              <span className="text-sm font-medium">
                {/* Stake + Profit = Payout */}$
                {(Number(stake || 0) + potentialProfit).toFixed(2)}
              </span>
            </div>

            {/* Profit */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">
                Net Profit (Ganancia):
              </span>
              <span
                className={`text-lg font-bold ${
                  potentialProfit > 0 ? "text-green-600" : "text-slate-900"
                }`}
              >
                ${potentialProfit.toFixed(2)}
              </span>
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
