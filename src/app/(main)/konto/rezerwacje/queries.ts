import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { ReservationsData } from "@/lib/types";

export const useReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: () => ky.get("/api/reservations").json<ReservationsData>(),
    staleTime: Infinity
  });
};
