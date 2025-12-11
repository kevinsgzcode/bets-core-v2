"use client";

import { useState } from "react";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Rocket, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OnboardingModal() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await completeOnboarding(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Account setup complete! Let's make some money.");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      {/* onOpenChange vacío impide cerrar el modal con click afuera o ESC */}
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
        {/* [&>button]:hidden oculta la X de cerrar de Shadcn */}

        <DialogHeader>
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to Bets Core!
          </DialogTitle>
          <DialogDescription className="text-center">
            Lets set up your financial profile so you can start tracking your
            performance accurately.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6 mt-4">
          {/* 1. INITIAL BANKROLL */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              1. What is your Starting Bankroll?
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                name="initialBankroll"
                type="number"
                placeholder="e.g. 1000.00"
                className="pl-10 text-lg"
                required
                min="1"
              />
            </div>
            <p className="text-xs text-slate-500">
              This will be your first deposit.
            </p>
          </div>

          {/* 2. CURRENCY */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">2. Currency</Label>
            <RadioGroup
              defaultValue="USD"
              name="currency"
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="USD" id="usd" className="peer sr-only" />
                <Label
                  htmlFor="usd"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-primary"
                >
                  <span className="mb-1 text-xl">🇺🇸</span>
                  <span className="font-semibold">USD ($)</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="MXN" id="mxn" className="peer sr-only" />
                <Label
                  htmlFor="mxn"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-primary"
                >
                  <span className="mb-1 text-xl">🇲🇽</span>
                  <span className="font-semibold">MXN ($)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 3. ODDS FORMAT */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              3. Preferred Odds Format
            </Label>
            <RadioGroup
              defaultValue="AMERICAN"
              name="oddsFormat"
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="AMERICAN"
                  id="american"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="american"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600"
                >
                  <span className="font-bold text-lg">-110 / +200</span>
                  <span className="text-sm text-slate-500">American</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="DECIMAL"
                  id="decimal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="decimal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600"
                >
                  <span className="font-bold text-lg">1.91 / 3.00</span>
                  <span className="text-sm text-slate-500">Decimal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Complete Setup
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
