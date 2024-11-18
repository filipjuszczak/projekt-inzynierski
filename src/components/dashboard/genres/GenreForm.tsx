"use client";

import { useTransition } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import LoadingButton from "@/components/LoadingButton";
import {
  createGenre,
  editGenre
} from "@/app/(staff)/staff/dashboard/(management)/genres/actions";
import { genreSchema, type GenreValues } from "@/lib/validation/genre";

interface GenreFormProps {
  id?: string;
  name?: string;
  ageRestriction?: string;
}

export default function GenreForm({
  id = "",
  name = "",
  ageRestriction = ""
}: GenreFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<GenreValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name,
      ageRestriction
    }
  });

  async function onFormSubmit(values: GenreValues) {
    startTransition(async () => {
      let result;
      let error;

      if (id) {
        result = await editGenre(id, values);
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
                <Input id={field.name} {...field} />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Brak</SelectItem>
                  <SelectItem value="12">12+</SelectItem>
                  <SelectItem value="15">15+</SelectItem>
                  <SelectItem value="18">18+</SelectItem>
                </SelectContent>
              </Select>
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
