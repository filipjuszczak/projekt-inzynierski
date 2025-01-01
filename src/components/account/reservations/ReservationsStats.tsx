"use client";

import { Ticket, Calendar, Clapperboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import ReservationStatsSkeleton from "@/components/account/reservations/skeletons/ReservationStatsSkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { useReservations } from "@/app/(main)/konto/rezerwacje/queries";

export default function ReservationsStats() {
  const { data, isLoading, isError } = useReservations();

  if (isLoading) {
    return <ReservationStatsSkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
    const currentDate = new Date();

    const upcomingShowtimes = data.reservations.filter(
      (reservation) => new Date(reservation.showtime.startTime) >= currentDate
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie rezerwacji</CardTitle>
          <CardDescription>Twoja aktywność w skrócie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center md:flex-col lg:flex-row">
              <Ticket className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Liczba rezerwacji: {data.reservations.length}
              </span>
            </div>
            <div className="flex items-center md:flex-col lg:flex-row">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Nadchodzące seanse: {upcomingShowtimes.length}
              </span>
            </div>
            <div className="flex items-center md:flex-col lg:flex-row">
              <Clapperboard className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Ulubiony gatunek: {data.favoriteGenre || "brak"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
