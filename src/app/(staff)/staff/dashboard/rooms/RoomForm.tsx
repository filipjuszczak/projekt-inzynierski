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
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useFetchRoomById } from "@/app/(staff)/staff/dashboard/rooms/queries";
import {
  createRoom,
  editRoom
} from "@/app/(staff)/staff/dashboard/rooms/actions";
import { createRoomFormSchema, CreateRoomValues } from "@/lib/validation/room";

interface RoomFormProps {
  roomId?: string;
}

export default function RoomForm({ roomId }: RoomFormProps) {
  const { data: roomData, isFetching, isError } = useFetchRoomById(roomId);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomFormSchema),
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

  async function onFormSubmit(values: CreateRoomValues) {
    startTransition(async () => {
      let error;

      if (roomId) {
        error = (await editRoom(roomId, values)).error;
      } else {
        error = (await createRoom(values)).error;
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
          name="number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Numer sali</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={isFetching ? "Ładowanie..." : ""}
                  disabled={isFetching || isError}
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
                  {...field}
                  placeholder={isFetching ? "Ładowanie..." : ""}
                  disabled={isFetching || isError}
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
                  {...field}
                  placeholder={isFetching ? "Ładowanie..." : ""}
                  disabled={isFetching || isError}
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
