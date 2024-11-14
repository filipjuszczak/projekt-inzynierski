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
import LoadingButton from "@/components/LoadingButton";
import { useFetchRoomById } from "@/app/(staff)/staff/dashboard/(main)/rooms/queries";
import {
  createRoom,
  editRoom
} from "@/app/(staff)/staff/dashboard/(main)/rooms/actions";
import { roomSchema, RoomValues } from "@/lib/validation/room";

interface RoomFormProps {
  roomId?: string;
}

export default function RoomForm({ roomId }: RoomFormProps) {
  const { data: roomData, isFetching, isError } = useFetchRoomById(roomId);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoomValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: "",
      numberOfRows: "",
      seatsPerRow: ""
    }
  });

  useEffect(() => {
    if (roomData) {
      form.reset({
        number: roomData.number.toString(),
        numberOfRows: roomData.numberOfRows.toString(),
        seatsPerRow: roomData.seatsPerRow.toString()
      });
    }
  }, [roomData, form]);

  async function onFormSubmit(values: RoomValues) {
    startTransition(async () => {
      let result;
      let error;

      if (roomId) {
        result = await editRoom(roomId, values);
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
                <Input
                  id={field.name}
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
          name="numberOfRows"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Liczba rzędów</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
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
          name="seatsPerRow"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Liczba siedzeń w rzędzie
              </FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  placeholder={isFetching ? "Ładowanie..." : ""}
                  disabled={isFetching || isError}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          isFetching={isFetching}
          isError={isError}
          idleText={roomId ? "Zapisz zmiany" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
