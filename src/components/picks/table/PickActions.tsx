"use client";

import { useState } from "react";
import { Pick, PickStatus } from "@prisma/client";
import { updatePickStatus, deletePick } from "@/actions/picks";
import { MoreHorizontal, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PickActionsProps {
  pick: Pick;
}

export function PickActions({ pick }: PickActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: PickStatus) => {
    setLoading(true);
    const result = await updatePickStatus(pick.id, status);
    setLoading(false);

    if (result.error) {
      alert("Error updating pick");
    } else {
      console.log("updated");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pick")) return;

    setLoading(true);
    const result = await deletePick(pick.id);
    setLoading(false);

    if (result.error) alert("Error deleting pick");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/*resolve actions*/}
        <DropdownMenuItem onClick={() => handleStatusChange("WON")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Mark as Won
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("LOST")}>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Mark as Lost
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("PUSH")}>
          <span className="mr-2 h-4 w-4 text-gray-500 text-center font-bold">
            P
          </span>
          Mark as Push
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/*destructive action*/}
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Pick
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
