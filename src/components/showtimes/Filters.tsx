"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isValid as isValidDate } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface ShowtimeFiltersProps {
  genres: { id: string; name: string }[];
  viewingModes: ViewingMode[];
  screenFormats: ScreenFormat[];
}

export default function Filters({
  genres,
  viewingModes,
  screenFormats
}: ShowtimeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDate = isValidDate(searchParams.get("date"))
    ? new Date(searchParams.get("date")!)
    : new Date();
  const initialGenre = searchParams.get("genre");
  const initialViewingMode = searchParams.get("viewingMode");
  const initialScreenFormat = searchParams.get("screenFormat");

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedViewingMode, setSelectedViewingMode] =
    useState(initialViewingMode);
  const [selectedScreenFormat, setSelectedScreenFormat] =
    useState(initialScreenFormat);

  // useEffect(() => {
  //   setSelectedGenre(searchParams.get("genre"));
  //   setSelectedViewingMode(searchParams.get("viewingMode"));
  //   setSelectedScreenFormat(searchParams.get("screenFormat"));
  // }, [searchParams]);

  function updateSearchParams(param: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "reset") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function handleFilterChange(
    param: "genre" | "viewingMode" | "screenFormat",
    newValue: string
  ) {
    const updatedValue = newValue;
    if (param === "genre") setSelectedGenre(updatedValue);
    if (param === "viewingMode") setSelectedViewingMode(updatedValue);
    if (param === "screenFormat") setSelectedScreenFormat(updatedValue);
    updateSearchParams(param, updatedValue);
  }

  function handleChangeDate(date: Date) {
    setSelectedDate(date);
    const params = new URLSearchParams(searchParams);
    params.set(
      "date",
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, "0")}`
    );
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="flex-1">
        <DatePicker value={selectedDate} onValueChange={handleChangeDate} />
      </div>
      <div className="flex-1">
        <Select
          value={selectedGenre || undefined}
          onValueChange={(value) => handleFilterChange("genre", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz gatunek filmu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reset">Brak</SelectItem>
            <SelectSeparator />
            {genres.map(({ id, name }) => (
              <SelectItem key={id} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select
          value={selectedScreenFormat || undefined}
          onValueChange={(value) => handleFilterChange("screenFormat", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz format ekranu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reset">Brak</SelectItem>
            <SelectSeparator />
            {screenFormats.map((format) => (
              <SelectItem key={format} value={format}>
                {SCREEN_FORMAT_LABELS[format]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select
          value={selectedViewingMode || undefined}
          onValueChange={(value) => handleFilterChange("viewingMode", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz format ekranu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reset">Brak</SelectItem>
            <SelectSeparator />
            {viewingModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {VIEWING_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
