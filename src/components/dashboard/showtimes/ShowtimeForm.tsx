"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roundToNearestMinutes } from "date-fns";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import DateTimePicker from "@/components/ui/date-time-picker";
import LoadingButton from "@/components/LoadingButton";
import {
  createShowtime,
  editShowtime
} from "@/app/(staff)/staff/dashboard/(management)/showtimes/actions";
import { showtimeSchema, type ShowtimeValues } from "@/lib/validation/showtime";

interface ShowtimeFormProps {
  id?: string;
  movieId?: string;
  roomId?: string;
  startTime?: Date;
  movies: { id: string; title: string }[];
  rooms: { id: string; number: string }[];
}

export default function ShowtimeForm({
  id = "",
  movieId = "",
  roomId = "",
  startTime = new Date(),
  movies,
  rooms
}: ShowtimeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShowtimeValues>({
    resolver: zodResolver(showtimeSchema),
    defaultValues: {
      movieId,
      roomId,
      startTime: roundToNearestMinutes(startTime, { nearestTo: 15 })
    }
  });

  async function onFormSubmit(values: ShowtimeValues) {
    startTransition(async () => {
      let result;
      let error;

      if (id) {
        result = await editShowtime(id, values);
        if ("error" in result) {
          error = result.error;
        }
      } else {
        result = await createShowtime(values);
        if ("error" in result) {
          error = result.error;
        }
      }

      if (error) {
        toast.error(error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Seans został zapisany.");
        return redirect("/staff/dashboard/showtimes");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="movieId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Film</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz..." />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="roomId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Sala</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz..." />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="startTime"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>Data rozpoczęcia</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText={id ? "Zapisz" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
