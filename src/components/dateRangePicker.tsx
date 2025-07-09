"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/src/utils/utils"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"
import { useState } from "react"


export function DateRangePicker({
  className,
  onChange,
  value,
}: {
  value?: DateRange | undefined,
  className?: string;
  onChange?: (range: DateRange | undefined) => void;
}) {

  const initialRange: DateRange | undefined = (() => {
    if (value?.from && !isNaN(value?.from.getTime()) && value.to && !isNaN(value.to.getTime())) {
      return { from: value?.from, to: value.to };
    }
    return undefined;
  })();

  const [date, setDate] = useState<DateRange | undefined>(initialRange);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (onChange) onChange(range);
  };

  const handleClear = () => {
    setDate(undefined);
    if (onChange) onChange(undefined);
    console.log("DateRangePicker", date);

  };

  console.log("DateRangePicker", date);

  const [open, setOpen] = useState(false);

  return (
    <div className={cn("grid gap-2 h-[100%]", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="h-[100%]">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal cursor-pointer",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>wähle ein Zeitraum</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
          <hr />
          <div className="flex m-1">
            {date?.to && (
              <Button variant={"ghost"} onClick={handleClear} className="cursor-pointer w-1/2">
                Auswahl aufheben
              </Button>
            )}
            <Button
              variant={"ghost"}
              className={`cursor-pointer ${date?.to ? "w-1/2 border-l" : "w-full"}`}
              onClick={() => setOpen(false)}
            >
              Schließen
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
