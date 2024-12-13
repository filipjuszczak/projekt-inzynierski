"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { setFeaturedMovie } from "@/app/(staff)/panel-pracownika/pulpit/actions";
import { toast } from "sonner";

interface ChangeFeaturedMovieProps {
  movies:
    | {
        id: string;
        title: string;
        isFeatured: boolean;
      }[]
    | null;
}

export default function ChangeFeaturedMovie({
  movies
}: ChangeFeaturedMovieProps) {
  const [open, setOpen] = useState(false);
  const [newFeaturedMovieId, setNewFeaturedMovieId] = useState("");

  const currentFeaturedMovie = movies?.find((movie) => movie.isFeatured);

  async function handleSetFeaturedMovie() {
    if (!newFeaturedMovieId) return;

    const result = await setFeaturedMovie(newFeaturedMovieId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Pomyślnie zmieniono wyróżniony film!");
    } else {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  return (
    <div>
      <div className="mb-1 text-sm text-muted-foreground">
        Zmień wyróżniony film
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mb-4 w-full justify-between"
          >
            {currentFeaturedMovie
              ? currentFeaturedMovie.title
              : newFeaturedMovieId
                ? movies?.find((movie) => movie.id === newFeaturedMovieId)!
                    .title
                : "Wybierz film..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Szukaj filmu..." />
            <CommandList>
              <ScrollArea className="h-24">
                <CommandEmpty>Brak filmów.</CommandEmpty>
                <CommandGroup>
                  {movies?.map((movie) => (
                    <CommandItem
                      key={movie.id}
                      value={movie.id}
                      onSelect={(currentValue) => {
                        setNewFeaturedMovieId(currentValue);
                        setOpen(false);
                      }}
                    >
                      {movie.title}
                      <Check
                        className={cn(
                          "ml-auto",
                          newFeaturedMovieId === movie.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button size="sm" onClick={handleSetFeaturedMovie} className="w-full">
        Zapisz
      </Button>
    </div>
  );
}
