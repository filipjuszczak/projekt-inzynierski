import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Showtime } from "@/lib/types";

export const useFetchShowtimes = () => {
  return useQuery({
    queryKey: ["showtimes"],
    queryFn: () => ky.get("/api/showtimes").json<Showtime[]>()
  });
};

export const useFetchShowtimeById = (showtimeId: string | undefined) => {
  return useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => ky.get(`/api/showtimes/${showtimeId}`).json<Showtime>(),
    enabled: !!showtimeId
  });
};
