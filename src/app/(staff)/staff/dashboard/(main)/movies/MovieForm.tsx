"use client";

import { Fragment, useEffect, useMemo, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput
} from "@/components/ui/file-upload";
import LoadingButton from "@/components/LoadingButton";
import { useFetchMovieById } from "@/app/(staff)/staff/dashboard/(main)/movies/queries";
import { useFetchGenres } from "@/app/(staff)/staff/dashboard/(main)/genres/queries";
import {
  createMovie,
  editMovie,
  updatePosterUrl
} from "@/app/(staff)/staff/dashboard/(main)/movies/actions";
import { validateMovieValues } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { movieSchema, type MovieValues } from "@/lib/validation/movie";
import type { Genre } from "@/lib/types";

const dropzoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false
};

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

  const genresLabels = useMemo(
    () => ({
      0: "Brak ograniczenia wiekowego",
      12: "12+",
      15: "15+",
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

  const form = useForm<MovieValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      posterImage: null,
      description: "",
      releaseDate: new Date().toString(),
      duration: "",
      genres: []
    }
  });

  const { startUpload } = useUploadThing("imageUploader", {
    onBeforeUploadBegin(files) {
      return files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File([file], `poster_${crypto.randomUUID()}.${extension}`, {
          type: file.type
        });
      });
    },
    onUploadError() {
      toast.error("Wystąpił błąd podczas przesyłania plakatu.");
    }
  });

  useEffect(() => {
    if (movieData) {
      form.setValue("title", movieData.title);
      form.setValue("description", movieData.description);
      form.setValue("releaseDate", movieData.releaseDate.toString());
      form.setValue("duration", movieData.duration.toString());
      form.setValue(
        "genres",
        movieData.genres.map((genre) => genre.genreId)
      );
    }
  }, [movieData, form]);

  async function onFormSubmit(values: MovieValues) {
    if (!validateMovieValues(form, values)) return;

    startTransition(async () => {
      let result;
      let error;

      if (movieId) {
        const { posterImage, ...rest } = values;
        result = await editMovie(movieId, rest);
        if ("error" in result) {
          error = result.error;
        }
      } else {
        const { posterImage, ...rest } = values;
        result = await createMovie(rest);
        if ("error" in result) {
          error = result.error;
        }
      }

      if (error) {
        toast.error(error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Film został zapisany.");

        if (values.posterImage) {
          const files = values.posterImage;
          const uploadResult = await startUpload(files);

          if (!uploadResult) {
            toast.error("Wystąpił błąd podczas przesyłania plakatu.");
          } else {
            const movieIdToUpdate = movieId || result.movieId;
            const posterUrl = uploadResult[0].url;
            const posterUpdateResult = await updatePosterUrl(
              movieIdToUpdate,
              posterUrl
            );

            if ("error" in posterUpdateResult) {
              toast.error(posterUpdateResult.error);
            } else {
              toast.success("Plakat został przesłany.");
              return redirect("/staff/dashboard/movies");
            }
          }
        } else {
          return redirect("/staff/dashboard/movies");
        }
      } else {
        toast.error(
          "Wystąpił błąd podczas zapisywania filmu. Spróbuj później."
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Tytuł filmu (wymagane)</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
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
          name="posterImage"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plakat filmu</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzoneConfig}
                  className="relative rounded-lg bg-background p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-white">
                    <div className="flex w-full flex-col items-center justify-center pb-4 pt-3">
                      <FileSvgDraw />
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {field.value && field.value.length > 0 && (
                      <FileUploaderItem index={0}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{field.value[0].name}</span>
                      </FileUploaderItem>
                    )}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Opis filmu (wymagane)</FormLabel>
              <FormControl>
                <Textarea
                  id={field.name}
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
          name="releaseDate"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>
                Data wydania (wymagane)
              </FormLabel>
              <FormControl>
                <DatePicker
                  onValueChange={field.onChange}
                  value={field.value}
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
                Czas trwania (w minutach, wymagane)
              </FormLabel>
              <FormControl>
                <Input
                  id={field.name}
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
              <FormLabel htmlFor={field.name}>
                Gatunki (wymagane min. 1)
              </FormLabel>
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((genreId) => (
                    <Badge key={genreId}>
                      {genresData?.find((g) => g.id === genreId)?.name}
                    </Badge>
                  ))}
                </div>
              )}
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

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Kliknij, aby przesłać</span>
        <br /> lub <br />
        przeciągnij i upuść
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        .jpg, .jpeg, .webp, .png
      </p>
    </>
  );
};
