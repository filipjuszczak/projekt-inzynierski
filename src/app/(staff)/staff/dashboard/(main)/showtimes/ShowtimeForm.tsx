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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SmartDatetimeInput } from "@/components/ui/smart-date-time-picker";
import LoadingButton from "@/components/LoadingButton";
import { useFetchShowtimeById } from "@/app/(staff)/staff/dashboard/(main)/showtimes/queries";
import { useFetchMovies } from "@/app/(staff)/staff/dashboard/(main)/movies/queries";
import { useFetchRooms } from "@/app/(staff)/staff/dashboard/(main)/rooms/queries";
import {
  createShowtime,
  editShowtime
} from "@/app/(staff)/staff/dashboard/(main)/showtimes/actions";
import { showtimeSchema, type ShowtimeValues } from "@/lib/validation/showtime";

interface ShowtimeFormProps {
  showtimeId?: string;
}

export default function ShowtimeForm({ showtimeId }: ShowtimeFormProps) {
  const {
    data: showtimeData,
    isFetching: showtimeDataIsFetching,
    isError: showtimeDataIsError
  } = useFetchShowtimeById(showtimeId);
  const {
    data: moviesData,
    isFetching: moviesDataIsFetching,
    isError: moviesDataIsError
  } = useFetchMovies();
  const {
    data: roomsData,
    isFetching: roomsDataIsFetching,
    isError: roomsDataIsError
  } = useFetchRooms();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShowtimeValues>({
    resolver: zodResolver(showtimeSchema),
    defaultValues: {
      movieId: "",
      roomId: "",
      startDate: undefined
    }
  });

  useEffect(() => {
    if (showtimeData) {
      const date = new Date(showtimeData.startTime);

      form.reset({
        movieId: showtimeData.movie.id,
        roomId: showtimeData.room.id,
        startDate: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        )
      });
    }
  }, [showtimeData, form]);

  async function onFormSubmit(values: ShowtimeValues) {
    startTransition(async () => {
      let result;
      let error;

      if (showtimeId) {
        result = await editShowtime(showtimeId, values);
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={moviesDataIsFetching || moviesDataIsError}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        moviesDataIsFetching ? "Ładowanie..." : "Wybierz..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {moviesData?.map((movie) => (
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={roomsDataIsFetching || roomsDataIsError}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        roomsDataIsFetching ? "Ładowanie..." : "Wybierz..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roomsData?.map((room) => (
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
          name="startDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Data rozpoczęcia</FormLabel>
              <FormControl>
                <SmartDatetimeInput
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          isFetching={
            showtimeDataIsFetching ||
            moviesDataIsFetching ||
            roomsDataIsFetching
          }
          isError={showtimeDataIsError || moviesDataIsError || roomsDataIsError}
          idleText={showtimeId ? "Zapisz" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
