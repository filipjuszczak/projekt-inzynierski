"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import createGenre from "@/app/(staff)/staff/dashboard/genres/new/actions";
import editGenre from "@/app/(staff)/staff/dashboard/genres/[id]/edit/actions";
import { createGenreFormSchema, type GenreValues } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useFetchGenreById } from "@/app/(staff)/staff/dashboard/genres/[id]/edit/queries";

interface GenreFormProps {
  genreId?: string;
}

export default function GenreForm({ genreId }: GenreFormProps) {
  const { data: genreData, isFetching, isError } = useFetchGenreById(genreId);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<GenreValues>({
    resolver: zodResolver(createGenreFormSchema),
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
      let error;

      if (genreId) {
        error = (await editGenre(genreId, values)).error;
      } else {
        error = (await createGenre(values)).error;
      }

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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Nazwa gatunku</FormLabel>
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
              <FormLabel htmlFor={field.name}>Ograniczenie wiekowe</FormLabel>
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
