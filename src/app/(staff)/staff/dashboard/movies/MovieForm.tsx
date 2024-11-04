"use client";

import { Fragment, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { createMovieFormSchema, CreateMovieValues } from "@/lib/validation";
import { useFetchMovieById } from "@/app/(staff)/staff/dashboard/movies/[id]/queries";
import { useFetchGenres } from "@/app/(staff)/staff/dashboard/genres/queries";
import { useToast } from "@/hooks/use-toast";
import type { Genre } from "@/lib/types";
import { createMovie } from "@/app/(staff)/staff/dashboard/movies/new/actions";
import { validateMovieValues } from "@/lib/utils";

interface MovieFormProps {
  movieId?: string;
}

export default function MovieForm({ movieId }: MovieFormProps) {
  const {
    data: movieData,
    isFetching: movieDataIsFetching,
    isError: movieDataIsError
  } = useFetchMovieById(movieId);
  const {
    data: genresData,
    isFetching: genresDataIsFetching,
    isError: genresDataIsError
  } = useFetchGenres();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const genresLabels = useMemo(
    () => ({
      0: "Brak ograniczenia wiekowego",
      12: "12+",
      18: "18+"
    }),
    []
  );

  const genresByAgeRestrictions = useMemo(
    () =>
      genresData?.reduce((acc: { [key: number]: Genre[] }, genre) => {
        const { ageRestriction } = genre;

        if (!acc[ageRestriction]) {
          acc[ageRestriction] = [];
        }

        acc[ageRestriction].push(genre);

        return acc;
      }, {}) || {},
    [genresData]
  );

  function handleCheckboxChange(genreId: string) {
    const prevGenres = form.getValues("genres");
    const updatedGenres = prevGenres.includes(genreId)
      ? prevGenres.filter((id) => id !== genreId)
      : [...prevGenres, genreId];
    form.setValue("genres", updatedGenres);
  }

  const form = useForm<CreateMovieValues>({
    resolver: zodResolver(createMovieFormSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseYear: "",
      duration: "",
      genres: []
    }
  });

  async function onFormSubmit(values: CreateMovieValues) {
    if (!validateMovieValues(form, values)) return;

    startTransition(async () => {
      const { error } = await createMovie(values);
      if (error) {
        toast({
          variant: "destructive",
          description: error
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Tytuł filmu</FormLabel>
              <FormControl>
                <Input
                  placeholder={movieDataIsFetching ? "Ładowanie..." : ""}
                  disabled={movieDataIsFetching || movieDataIsError}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Opis filmu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={movieDataIsFetching ? "Ładowanie..." : ""}
                  disabled={movieDataIsFetching || movieDataIsError}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="releaseYear"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Rok produkcji</FormLabel>
              <FormControl>
                <Input
                  placeholder={movieDataIsFetching ? "Ładowanie..." : ""}
                  disabled={movieDataIsFetching || movieDataIsError}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="duration"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Czas trwania (w minutach)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={movieDataIsFetching ? "Ładowanie..." : ""}
                  disabled={movieDataIsFetching || movieDataIsError}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="genres"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>Gatunki</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Wybierz...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.keys(genresByAgeRestrictions).map((key) => {
                      const numericKey = Number(
                        key
                      ) as keyof typeof genresLabels;
                      return (
                        <Fragment key={numericKey}>
                          <DropdownMenuLabel>
                            {genresLabels[numericKey]}
                          </DropdownMenuLabel>
                          {genresByAgeRestrictions[numericKey].map((genre) => (
                            <DropdownMenuCheckboxItem
                              key={genre.id}
                              onCheckedChange={() =>
                                handleCheckboxChange(genre.id)
                              }
                              checked={field.value.includes(genre.id)}
                            >
                              {genre.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                          <DropdownMenuSeparator />
                        </Fragment>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          isFetching={movieDataIsFetching || genresDataIsFetching}
          isError={movieDataIsError || genresDataIsError}
          idleText={movieId ? "Zapisz zmiany" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
