"use client";

import { useEffect, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import LoadingButton from "@/components/LoadingButton";
import { genreSchema, type GenreValues } from "@/lib/validation/genre";
import { useFetchGenreById } from "@/app/(staff)/staff/dashboard/genres/queries";
import {
  createGenre,
  editGenre
} from "@/app/(staff)/staff/dashboard/genres/actions";

interface GenreFormProps {
  genreId?: string;
}

export default function GenreForm({ genreId }: GenreFormProps) {
  const { data: genreData, isFetching, isError } = useFetchGenreById(genreId);
  const [isPending, startTransition] = useTransition();

  const form = useForm<GenreValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: "",
      ageRestriction: ""
    }
  });

  useEffect(() => {
    if (genreData) {
      form.reset({
        name: genreData.name,
        ageRestriction: genreData.ageRestriction.toString()
      });
    }
  }, [genreData, form]);

  async function onFormSubmit(values: GenreValues) {
    startTransition(async () => {
      let result;
      let error;

      if (genreId) {
        result = await editGenre(genreId, values);
        if ("error" in result) {
          error = result.error;
        }
      } else {
        result = await createGenre(values);
        if ("error" in result) {
          error = result.error;
        }
      }

      if (error) {
        toast.error(error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Gatunek został pomyślnie zapisany.");
        return redirect("/staff/dashboard/genres");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Nazwa gatunku (wymagane)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={isFetching ? "Ładowanie..." : ""}
                  disabled={isFetching || isError}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="ageRestriction"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel htmlFor={field.name}>
                Ograniczenie wiekowe (wymagane)
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isFetching || isError}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isFetching ? "Ładowanie" : "Wybierz..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key="0" value="0">
                      Brak
                    </SelectItem>
                    <SelectItem key="12" value="12">
                      12+
                    </SelectItem>
                    <SelectItem key="15" value="15">
                      15+
                    </SelectItem>
                    <SelectItem key="18" value="18">
                      18+
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          isFetching={isFetching}
          isError={isError}
          idleText={genreId ? "Zapisz zmiany" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
