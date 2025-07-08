"use client"

import * as React from "react"
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

export function DateRangePicker({
  className,
  onChange, 
  value,
}: {
   value?: DateRange | undefined,
  className?: string;
  onChange?: (range: DateRange | undefined) => void; 
}) {
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: value?.from || undefined,
    to: value?.to || undefined,});

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (onChange) onChange(range);
  };

  return (
    <div className={cn("grid gap-2 h-[100%]", className)}>
      <Popover className="h-[100%]">
        <PopoverTrigger asChild className="h-[100%]">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal cursor-pointer",
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
              <span>Pick a date</span>
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
        </PopoverContent>
      </Popover>
    </div>
  )
}
