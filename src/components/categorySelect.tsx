"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/src/utils/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Category } from "@/src/types/category";

type CategorySelectProps = {
  data: Category[];
  value?: string;
  onChange?: (value: string) => void;
};

export function CategorySelect({ data, value, onChange }: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value ?? "");

  // Sync external value
  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === internalValue ? "" : currentValue;
    setInternalValue(newValue);
    setOpen(false);
    onChange?.(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between cursor-pointer"
        >
          {internalValue
            ? data.find((cat) => String(cat.id) === internalValue)?.name
            : "Kategorie auswählen"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Kategorie auswählen" className="h-9" />
          <CommandList>
            <CommandEmpty>Keine Kategorie gefunden</CommandEmpty>
            <CommandGroup>
              {data.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={String(cat.id)}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  {cat.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      internalValue === String(cat.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
