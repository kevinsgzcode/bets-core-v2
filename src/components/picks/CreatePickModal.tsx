"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePickForm } from "./CreatePickForm";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore } from "@/lib/store";

interface CreatePickModalProps {
  buttonLabel?: string;
  currentBank: number;
}

export function CreatePickModal({
  buttonLabel = "Add Pick",
  currentBank,
}: CreatePickModalProps) {
  //set react state
  const [isOpen, setIsOpen] = useState(false);

  const oddsFormat = useSettingsStore((s) => s.oddsFormat);

  //bankrupt
  const isBankrupt = currentBank <= 0.01;

  if (isBankrupt) {
    return (
      <Button
        variant="destructive"
        className="gap-2 opacity-90"
        onClick={() =>
          toast.error("Bankroll depleted! Please deposit funds via Wallet.")
        }
      >
        <AlertCircle className="h-4 w-4" />
        Not enought money
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/*Trigger */}
      <DialogTrigger asChild>
        <Button variant="default">{buttonLabel}</Button>
      </DialogTrigger>

      {/* Te content is what appears inside the popup */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Pick</DialogTitle>
          <DialogDescription>
            Enter the details of your bet to track it in your dashboard
          </DialogDescription>
        </DialogHeader>
        {/* Form */}
        <CreatePickForm
          onSuccess={() => setIsOpen(false)}
          oddsFormat={oddsFormat}
        />
      </DialogContent>
    </Dialog>
  );
}
