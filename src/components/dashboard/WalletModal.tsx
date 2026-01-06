"use client";

import { useState } from "react";
import { createTransaction } from "@/actions/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/format";

interface WalletModalProps {
  runStats: any | null;
}

export function WalletModal({ runStats }: WalletModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const maxWithdrawable = runStats?.equity ?? 0;

  const handleTransaction = async (type: "DEPOSIT" | "WITHDRAWAL") => {
    const val = parseFloat(amount);

    // Basic validation
    if (!val || val <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Withdrawal-specific validation (UX guard)
    if (type === "WITHDRAWAL") {
      if (!runStats) {
        toast.error("No active bankroll. Please deposit funds first.");
        return;
      }

      if (val > maxWithdrawable + 0.01) {
        toast.error(
          `Insufficient funds. Max: ${formatCurrency(maxWithdrawable)}`
        );
        return;
      }
    }

    setLoading(true);
    const result = await createTransaction(type, val);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        type === "DEPOSIT"
          ? "Funds added successfully!"
          : "Withdrawal recorded. Run closed."
      );
      setOpen(false);
      setAmount("");
    }
  };

  const handleSetMax = () => {
    setAmount(maxWithdrawable.toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          Wallet
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Bankroll</DialogTitle>
          <DialogDescription>
            Deposit funds or close your current run by withdrawing.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          {/* DEPOSIT */}
          <TabsContent value="deposit" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount to Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">
                  $
                </span>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="1000.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleTransaction("DEPOSIT")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4" />
              )}
              Add Funds
            </Button>
          </TabsContent>

          {/* WITHDRAW */}
          <TabsContent value="withdraw" className="space-y-4 py-4">
            {!runStats ? (
              <p className="text-sm text-slate-500">
                No active bankroll. Deposit funds to start a new run.
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                  <span
                    className="text-xs text-slate-500 cursor-pointer hover:text-indigo-500 hover:underline"
                    onClick={handleSetMax}
                  >
                    Available: {formatCurrency(maxWithdrawable)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">
                    $
                  </span>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 text-xs text-indigo-500"
                    onClick={handleSetMax}
                  >
                    MAX
                  </Button>
                </div>

                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleTransaction("WITHDRAWAL")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                  )}
                  Close Run & Withdraw
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
