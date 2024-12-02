"use client";

import * as React from "react";
import {
  addDays,
  format,
  getMonth,
  getYear,
  setMonth,
  setYear
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const polishMonths = {
  January: "Styczeń",
  February: "Luty",
  March: "Marzec",
  April: "Kwiecień",
  May: "Maj",
  June: "Czerwiec",
  July: "Lipiec",
  August: "Sierpień",
  September: "Wrzesień",
  October: "Październik",
  November: "Listopad",
  December: "Grudzień"
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

interface DatePickerWithYearsProps {
  onValueChange: (date: Date) => void;
  value: Date;
  startYear?: number;
  endYear?: number;
  className?: string;
}

export function DatePickerWithYears({
  onValueChange,
  value,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 10,
  className
}: DatePickerWithYearsProps) {
  const date = value;

  const years = React.useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    onValueChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, Number(year));
    onValueChange(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onValueChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd.MM.yyyy") : <span>Wybierz...</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Miesiąc" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {polishMonths[month as keyof typeof polishMonths]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Rok" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={`year-${year}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={date}
          onMonthChange={onValueChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerProps {
  value: Date;
  onValueChange: (date: Date) => void;
}

export function DatePicker({ value, onValueChange }: DatePickerProps) {
  const date = value;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onValueChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd.MM.yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            handleSelect(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Dzisiaj</SelectItem>
            <SelectItem value="1">Jutro</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
