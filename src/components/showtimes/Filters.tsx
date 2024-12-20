"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { isValid as isValidDate } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/date-picker";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

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
    window.history.pushState({}, "", `?${params.toString()}`);
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
    window.history.pushState({}, "", `?${params.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-col flex-wrap gap-4 md:flex-row">
      <DateFilter value={selectedDate} onValueChange={handleChangeDate} />
      <MovieFilter
        value={selectedTitle}
        onValueChange={(value) => handleFilterChange("title", value)}
        movies={movies}
      />
      <GenreFilter
        value={selectedGenre}
        onValueChange={(value) => handleFilterChange("genre", value)}
        genres={genres}
      />
      <ScreenFormatFilter
        value={selectedScreenFormat}
        onValueChange={(value) => handleFilterChange("screenFormat", value)}
        formats={screenFormats}
      />
      <ViewingModeFilter
        value={selectedViewingMode}
        onValueChange={(value) => handleFilterChange("viewingMode", value)}
        modes={viewingModes}
      />
    </div>
  );
}

interface FilterProps {
  value: string | Date | null | undefined;
  onValueChange: (value: any) => void;
}

function DateFilter({ value, onValueChange }: FilterProps) {
  return (
    <div className="flex-1 space-y-2">
      <div className="w-fit text-sm text-muted-foreground">Data</div>
      <DatePicker value={value as Date} onValueChange={onValueChange} />
    </div>
  );
}

function MovieFilter({
  value,
  onValueChange,
  movies
}: FilterProps & { movies: ShowtimeFiltersProps["movies"] }) {
  return (
    <div className="flex-1 space-y-2">
      <div className="w-fit text-sm text-muted-foreground">Film</div>
      <Select
        value={(value as string) || undefined}
        onValueChange={onValueChange}
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
  );
}

function GenreFilter({
  value,
  onValueChange,
  genres
}: FilterProps & { genres: ShowtimeFiltersProps["genres"] }) {
  return (
    <div className="flex-1 space-y-2">
      <div className="w-fit text-sm text-muted-foreground">Gatunek filmu</div>
      <Select
        value={(value as string) || undefined}
        onValueChange={onValueChange}
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
  );
}

function ScreenFormatFilter({
  value,
  onValueChange,
  formats
}: FilterProps & { formats: ShowtimeFiltersProps["screenFormats"] }) {
  return (
    <div className="flex-1 space-y-2">
      <div className="w-fit text-sm text-muted-foreground">Format ekranu</div>
      <Select
        value={(value as string) || undefined}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz format ekranu" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-fit rounded-md border">
            <SelectItem value="reset">Brak</SelectItem>
            <SelectSeparator />
            {formats.map((format) => (
              <SelectItem key={format} value={format}>
                {SCREEN_FORMAT_LABELS[format]}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}

function ViewingModeFilter({
  value,
  onValueChange,
  modes
}: FilterProps & { modes: ShowtimeFiltersProps["viewingModes"] }) {
  return (
    <div className="flex-1 space-y-2">
      <div className="w-fit text-sm text-muted-foreground">Rodzaj audio</div>
      <Select
        value={(value as string) || undefined}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz format ekranu" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-fit rounded-md border">
            <SelectItem value="reset">Brak</SelectItem>
            <SelectSeparator />
            {modes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {VIEWING_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
