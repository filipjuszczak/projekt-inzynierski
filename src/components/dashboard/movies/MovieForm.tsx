"use client";

import { Fragment, useCallback, useMemo, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ScreenFormat, ViewingMode } from "@prisma/client";
import { Paperclip } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput
} from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithYears } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import {
  createMovie,
  editMovie,
  updatePosterUrl
} from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/actions";
import { useUploadThing } from "@/lib/uploadthing";
import {
  VIEWING_MODE_LABELS,
  SCREEN_FORMAT_LABELS,
  GENRE_LABELS
} from "@/lib/constants";
import { movieSchema, type MovieValues } from "@/lib/validation/movie";
import type { Genre } from "@/lib/types";

const dropzoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false
};

interface MovieFormProps {
  id?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  releaseDate?: Date;
  duration?: string;
  viewingModes?: ViewingMode[];
  screenFormats?: ScreenFormat[];
  selectedGenres?: string[];
  genres: {
    id: string;
    name: string;
    ageRestriction: number;
    _count: {
      movies: number;
    };
  }[];
}

export default function MovieForm({
  id = "",
  title = "",
  description = "",
  shortDescription = "",
  releaseDate = new Date(),
  duration = "",
  viewingModes = [],
  screenFormats = [],
  selectedGenres = [],
  genres
}: MovieFormProps) {
  const [isPending, startTransition] = useTransition();

  const genresByAgeRestrictions = useMemo(
    () =>
      genres.reduce((acc: { [key: number]: Genre[] }, genre) => {
        const { ageRestriction } = genre;

        if (!acc[ageRestriction]) {
          acc[ageRestriction] = [];
        }

        acc[ageRestriction].push(genre);

        return acc;
      }, {}),
    [genres]
  );

  const form = useForm<MovieValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title,
      posterImage: null,
      description,
      shortDescription,
      releaseDate,
      duration,
      viewingModes,
      screenFormats,
      genres: selectedGenres
    }
  });

  const handleCheckboxChange = useCallback(
    <T extends string | ViewingMode | ScreenFormat>(
      field: "genres" | "viewingModes" | "screenFormats",
      value: T
    ) => {
      const prevValues = form.getValues(field) as T[];
      const updatedValues = prevValues.includes(value)
        ? prevValues.filter((v: T) => v !== value)
        : [...prevValues, value];
      form.setValue(field, updatedValues);
    },
    [form]
  );

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

  async function onFormSubmit(values: MovieValues) {
    startTransition(async () => {
      let result;
      let error;

      if (id) {
        const { posterImage, ...rest } = values;
        result = await editMovie(id, rest);
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
            const movieIdToUpdate = id || result.movieId;
            const posterUrl = uploadResult[0].url;
            const posterUpdateResult = await updatePosterUrl(
              movieIdToUpdate,
              posterUrl
            );

            if ("error" in posterUpdateResult) {
              toast.error(posterUpdateResult.error);
            } else {
              toast.success("Plakat został przesłany.");
              return redirect("/panel-pracownika/pulpit/filmy");
            }
          }
        } else {
          return redirect("/panel-pracownika/pulpit/filmy");
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
                <Input id={field.name} {...field} />
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
                <Textarea id={field.name} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="shortDescription"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Krótki opis filmu (wymagane)
              </FormLabel>
              <FormControl>
                <Textarea id={field.name} className="resize-none" {...field} />
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
                <DatePickerWithYears
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
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="viewingModes"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>
                Rodzaj audio (wymagane)
              </FormLabel>
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((mode) => (
                    <Badge key={mode}>{VIEWING_MODE_LABELS[mode]}</Badge>
                  ))}
                </div>
              )}
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Wybierz...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.values(ViewingMode).map((mode) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={mode}
                          onCheckedChange={() =>
                            handleCheckboxChange("viewingModes", mode)
                          }
                          checked={field.value.includes(mode)}
                        >
                          {VIEWING_MODE_LABELS[mode]}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="screenFormats"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>
                Format obrazu (wymagane)
              </FormLabel>
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((format) => (
                    <Badge key={format}>{SCREEN_FORMAT_LABELS[format]}</Badge>
                  ))}
                </div>
              )}
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Wybierz...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {Object.values(ScreenFormat).map((format) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={format}
                          onCheckedChange={() =>
                            handleCheckboxChange("screenFormats", format)
                          }
                          checked={field.value.includes(format)}
                        >
                          {SCREEN_FORMAT_LABELS[format]}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      {genres.find((g) => g.id === genreId)?.name}
                    </Badge>
                  ))}
                </div>
              )}
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Wybierz...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.keys(genresByAgeRestrictions).map((key) => {
                      const numericKey = Number(
                        key
                      ) as keyof typeof GENRE_LABELS;
                      return (
                        <Fragment key={numericKey}>
                          <DropdownMenuLabel>
                            {GENRE_LABELS[numericKey]}
                          </DropdownMenuLabel>
                          {genresByAgeRestrictions[numericKey].map((genre) => (
                            <DropdownMenuCheckboxItem
                              key={genre.id}
                              onCheckedChange={() =>
                                handleCheckboxChange("genres", genre.id)
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
          idleText={id ? "Zapisz zmiany" : "Utwórz"}
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
