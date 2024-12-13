"use client";

import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShowtimeFiltersProps {
  genres: { id: string; name: string }[];
  movies: { id: string; title: string }[];
  viewingModes: ViewingMode[];
  screenFormats: ScreenFormat[];
}

export default function Filters({
  genres,
  movies,
  viewingModes,
  screenFormats
}: ShowtimeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTitle = searchParams.get("title");
  const initialDate = isValidDate(searchParams.get("date"))
    ? new Date(searchParams.get("date")!)
    : new Date();
  const initialGenre = searchParams.get("genre");
  const initialViewingMode = searchParams.get("viewingMode");
  const initialScreenFormat = searchParams.get("screenFormat");

  const [selectedTitle, setSelectedTitle] = useState(initialTitle);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedViewingMode, setSelectedViewingMode] =
    useState(initialViewingMode);
  const [selectedScreenFormat, setSelectedScreenFormat] =
    useState(initialScreenFormat);

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
    param: "title" | "genre" | "viewingMode" | "screenFormat",
    newValue: string
  ) {
    const updatedValue = newValue;
    if (param === "title") setSelectedTitle(updatedValue);
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
    <div className="mb-8 flex flex-col flex-wrap gap-4 md:flex-row">
      <div className="flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Data</div>
        <DatePicker value={selectedDate} onValueChange={handleChangeDate} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Film</div>
        <Select
          value={selectedTitle || undefined}
          onValueChange={(value) => handleFilterChange("title", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz film" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72 rounded-md border">
              <SelectItem value="reset">Brak</SelectItem>
              <SelectSeparator />
              {movies.map((movie) => (
                <SelectItem
                  key={movie.id}
                  value={encodeURIComponent(movie.title)}
                >
                  {movie.title}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Gatunek filmu</div>
        <Select
          value={selectedGenre || undefined}
          onValueChange={(value) => handleFilterChange("genre", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz gatunek filmu" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72 rounded-md border">
              <SelectItem value="reset">Brak</SelectItem>
              <SelectSeparator />
              {genres.map(({ id, name }) => (
                <SelectItem key={id} value={name}>
                  {name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Format ekranu</div>
        <Select
          value={selectedScreenFormat || undefined}
          onValueChange={(value) => handleFilterChange("screenFormat", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz format ekranu" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-fit rounded-md border">
              <SelectItem value="reset">Brak</SelectItem>
              <SelectSeparator />
              {screenFormats.map((format) => (
                <SelectItem key={format} value={format}>
                  {SCREEN_FORMAT_LABELS[format]}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Rodzaj audio</div>
        <Select
          value={selectedViewingMode || undefined}
          onValueChange={(value) => handleFilterChange("viewingMode", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz format ekranu" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-fit rounded-md border">
              <SelectItem value="reset">Brak</SelectItem>
              <SelectSeparator />
              {viewingModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {VIEWING_MODE_LABELS[mode]}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
