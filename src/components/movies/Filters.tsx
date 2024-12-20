"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  async function updateSearchParams(param: string, values: string[]) {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    values.forEach((value) => params.append(param, value));
    window.history.pushState({}, "", `?${params.toString()}`);
  }

  function debouncedUpdateParams(param: string, values: string[]) {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      await updateSearchParams(param, values);
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
      <Filter
        title="Gatunki"
        items={genres}
        checkedItems={checkedGenres}
        onFilterChange={(genre, isChecked) =>
          handleFilterChange("genre", checkedGenres, genre, isChecked)
        }
        getLabel={(genre) => genre.name}
        getId={(genre) => genre.id}
        scrollable
      />
      <Filter
        title="Rodzaj audio"
        items={viewingModes}
        checkedItems={checkedViewingModes}
        onFilterChange={(mode, isChecked) =>
          handleFilterChange(
            "viewingMode",
            checkedViewingModes,
            mode,
            isChecked
          )
        }
        getLabel={(mode) => VIEWING_MODE_LABELS[mode]}
        getId={(mode) => mode}
      />
      <Filter
        title="Format"
        items={screenFormats}
        checkedItems={checkedScreenFormats}
        onFilterChange={(format, isChecked) =>
          handleFilterChange(
            "screenFormat",
            checkedScreenFormats,
            format,
            isChecked
          )
        }
        getLabel={(format) => SCREEN_FORMAT_LABELS[format]}
        getId={(format) => format}
      />
    </div>
  );
}

interface FilterProps<T> {
  title: string;
  items: T[];
  checkedItems: string[];
  onFilterChange: (item: string, isChecked: CheckedState) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  scrollable?: boolean;
}

function Filter<T>({
  items,
  checkedItems,
  onFilterChange,
  title,
  getLabel,
  getId,
  scrollable = false
}: FilterProps<T>) {
  const Content = (
    <div>
      {items.map((item) => (
        <div key={getId(item)}>
          <Label
            htmlFor={getId(item)}
            className="flex cursor-pointer items-center gap-2 p-1 hover:text-primary peer-hover:text-primary"
          >
            <Checkbox
              id={getId(item)}
              checked={checkedItems.includes(getLabel(item))}
              onCheckedChange={(isChecked) =>
                onFilterChange(getLabel(item), isChecked)
              }
              className="size-6 md:size-4"
            />
            <span>{getLabel(item)}</span>
          </Label>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-2 text-lg font-semibold">{title}</div>
      {scrollable ? (
        <ScrollArea className="h-[6.9rem] md:h-[8rem]">{Content}</ScrollArea>
      ) : (
        Content
      )}
    </div>
  );
}
