"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface FiltersProps {
  genres: {
    id: string;
    name: string;
  }[];
  viewingModes: ViewingMode[];
  screenFormats: ScreenFormat[];
}

export default function Filters({
  genres,
  viewingModes,
  screenFormats
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialGenres = searchParams.getAll("genre");
  const initialViewingModes = searchParams.getAll("viewingMode");
  const initialScreenFormats = searchParams.getAll("screenFormat");

  const [checkedGenres, setCheckedGenres] = useState(initialGenres);
  const [checkedViewingModes, setCheckedViewingModes] =
    useState(initialViewingModes);
  const [checkedScreenFormats, setCheckedScreenFormats] =
    useState(initialScreenFormats);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCheckedGenres(searchParams.getAll("genre"));
    setCheckedViewingModes(searchParams.getAll("viewingMode"));
    setCheckedScreenFormats(searchParams.getAll("screenFormat"));
  }, [searchParams]);

  function updateSearchParams(param: string, values: string[]) {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    values.forEach((value) => params.append(param, value));
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function debouncedUpdateParams(param: string, values: string[]) {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      updateSearchParams(param, values);
    }, 500);
  }

  function handleFilterChange(
    param: string,
    currentValues: string[],
    newValue: string,
    isChecked: CheckedState
  ) {
    const updatedValues = isChecked
      ? [...currentValues, newValue]
      : currentValues.filter((v) => v !== newValue);
    if (param === "genre") setCheckedGenres(updatedValues);
    if (param === "viewingMode") setCheckedViewingModes(updatedValues);
    if (param === "screenFormat") setCheckedScreenFormats(updatedValues);
    debouncedUpdateParams(param, updatedValues);
  }

  return (
    <div className="space-y-6">
      <GenreFilter
        genres={genres}
        checkedGenres={checkedGenres}
        onFilterChange={(genre, isChecked) =>
          handleFilterChange("genre", checkedGenres, genre, isChecked)
        }
      />
      <ViewingModeFilter
        viewingModes={viewingModes}
        checkedViewingModes={checkedViewingModes}
        onFilterChange={(mode, isChecked) =>
          handleFilterChange(
            "viewingMode",
            checkedViewingModes,
            mode,
            isChecked
          )
        }
      />
      <ScreenFormatFilter
        screenFormats={screenFormats}
        checkedScreenFormats={checkedScreenFormats}
        onFilterChange={(format, isChecked) =>
          handleFilterChange(
            "screenFormat",
            checkedScreenFormats,
            format,
            isChecked
          )
        }
      />
    </div>
  );
}

function GenreFilter({
  genres,
  checkedGenres,
  onFilterChange
}: {
  genres: { id: string; name: string }[];
  checkedGenres: string[];
  onFilterChange: (genre: string, isChecked: CheckedState) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Gatunki</h3>
      <div className="space-y-2">
        {genres.map((genre) => (
          <div key={genre.id} className="flex items-center">
            <Checkbox
              id={genre.id}
              checked={checkedGenres.includes(genre.name)}
              onCheckedChange={(isChecked) =>
                onFilterChange(genre.name, isChecked)
              }
            />
            <Label htmlFor={genre.id} className="ml-2">
              {genre.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewingModeFilter({
  viewingModes,
  checkedViewingModes,
  onFilterChange
}: {
  viewingModes: ViewingMode[];
  checkedViewingModes: string[];
  onFilterChange: (mode: ViewingMode, isChecked: CheckedState) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Rodzaj audio</h3>
      <div className="space-y-2">
        {viewingModes.map((mode) => (
          <div key={mode} className="flex items-center">
            <Checkbox
              id={mode}
              checked={checkedViewingModes.includes(mode)}
              onCheckedChange={(isChecked) => onFilterChange(mode, isChecked)}
            />
            <Label htmlFor={mode} className="ml-2">
              {VIEWING_MODE_LABELS[mode]}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenFormatFilter({
  screenFormats,
  checkedScreenFormats,
  onFilterChange
}: {
  screenFormats: ScreenFormat[];
  checkedScreenFormats: string[];
  onFilterChange: (format: ScreenFormat, isChecked: CheckedState) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Format</h3>
      <div className="space-y-2">
        {screenFormats.map((format) => (
          <div key={format} className="flex items-center">
            <Checkbox
              id={format}
              checked={checkedScreenFormats.includes(format)}
              onCheckedChange={(isChecked) => onFilterChange(format, isChecked)}
            />
            <Label htmlFor={format} className="ml-2">
              {SCREEN_FORMAT_LABELS[format]}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
