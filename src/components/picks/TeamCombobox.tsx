import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NFL_TEAMS } from "@/lib/constants";

interface TeamComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TeamCombobox({ value, onChange, disabled }: TeamComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? NFL_TEAMS.find((team) => team.value === value)?.label
            : "Select team..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found</CommandEmpty>
            <CommandGroup>
              {NFL_TEAMS.map((team) => (
                <CommandItem
                  key={team.value}
                  value={team.label}
                  onSelect={() => {
                    //save the ID
                    onChange(team.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === team.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {team.label} ({team.abbr})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
