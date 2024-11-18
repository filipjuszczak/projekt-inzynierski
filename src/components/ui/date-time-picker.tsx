"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
  onValueChange: (date: Date) => void;
  value: Date;
}

export default function DateTimePicker({
  onValueChange,
  value
}: DateTimePickerProps) {
  const date = new Date(value.getTime());

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      let newDate = setHours(selectedDate, date.getHours());
      newDate = setMinutes(newDate, date.getMinutes());
      onValueChange(newDate);
    }
  };

  const handleChangeTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    let newDate = setHours(date, Number(hours));
    newDate = setMinutes(newDate, Number(minutes));
    onValueChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd.MM.yyyy HH:mm") : <span>Wybierz...</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        <div>
          <h3 className="py-2 text-center text-sm font-medium">Godzina</h3>
          <ScrollArea className="h-[85%] w-full py-0.5 focus-visible:border-0 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0">
            <ul className="flex h-full max-h-56 w-28 flex-col items-center gap-1 px-1 py-0.5">
              {Array.from({ length: 24 }, (_, hour) => {
                return Array.from({ length: 4 }).map((_, minute) => {
                  const paddedHour = hour.toString().padStart(2, "0");
                  const paddedMinute = (15 * minute)
                    .toString()
                    .padStart(2, "0");
                  const fullTime = `${paddedHour}:${paddedMinute}`;
                  const selected = format(date, "HH:mm") === fullTime;
                  return (
                    <li
                      key={fullTime}
                      className={cn(
                        buttonVariants({
                          variant: selected ? "default" : "outline"
                        }),
                        "h-8 w-full cursor-default px-3 text-sm outline-0 ring-0 focus-visible:border-0 focus-visible:outline-0"
                      )}
                      onClick={() => handleChangeTime(fullTime)}
                    >
                      {paddedHour}:{paddedMinute}
                    </li>
                  );
                });
              })}
            </ul>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
