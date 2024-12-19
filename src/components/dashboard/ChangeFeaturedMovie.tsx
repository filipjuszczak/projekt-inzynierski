"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import LoadingButton from "@/components/LoadingButton";
import { setFeaturedMovie } from "@/app/(staff)/panel-pracownika/pulpit/actions";
import { cn } from "@/lib/utils";

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
  const [isPending, setIsPending] = useState(false);

  const currentFeaturedMovie = movies?.find((movie) => movie.isFeatured);

  async function handleSetFeaturedMovie() {
    if (!newFeaturedMovieId) return;

    setIsPending(true);
    const result = await setFeaturedMovie(newFeaturedMovieId);
    setIsPending(false);

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
            {newFeaturedMovieId
              ? movies?.find((movie) => movie.id === newFeaturedMovieId)!.title
              : currentFeaturedMovie
                ? currentFeaturedMovie.title
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
      {/* <Button size="sm" onClick={handleSetFeaturedMovie} className="w-full">
        Zapisz
      </Button> */}
      <LoadingButton
        onClick={handleSetFeaturedMovie}
        isPending={isPending}
        loadingText="Zapisywanie..."
        idleText="Zapisz"
        className="w-full"
      />
    </div>
  );
}
