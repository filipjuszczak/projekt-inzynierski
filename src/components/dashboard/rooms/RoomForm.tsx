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
import LoadingButton from "@/components/LoadingButton";
import {
  createRoom,
  editRoom
} from "@/app/(staff)/staff/dashboard/(management)/rooms/actions";
import { roomSchema, RoomValues } from "@/lib/validation/room";

interface RoomFormProps {
  id?: string;
  number?: string;
  numberOfRows?: string;
  seatsPerRow?: string;
}

export default function RoomForm({
  id = "",
  number = "",
  numberOfRows = "",
  seatsPerRow = ""
}: RoomFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoomValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number,
      numberOfRows,
      seatsPerRow
    }
  });

  async function onFormSubmit(values: RoomValues) {
    startTransition(async () => {
      let result;
      let error;

      if (id) {
        result = await editRoom(id, values);
        if ("error" in result) {
          error = result.error;
        }
      } else {
        result = await createRoom(values);
        if ("error" in result) {
          error = result.error;
        }
      }

      if (error) {
        toast.error(error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Sala została zapisana.");
        return redirect("/staff/dashboard/rooms");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Numer sali</FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="numberOfRows"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Liczba rzędów</FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="seatsPerRow"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Liczba siedzeń w rzędzie
              </FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
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
