"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Clock, Film, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserReservation } from "@/lib/types";

interface ReservationsProps {
  reservations: UserReservation[];
}

export default function Reservations({ reservations }: ReservationsProps) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const currentDate = new Date();

  const upcomingReservations = reservations.filter(
    (r) => r.showtime.startTime >= currentDate
  );

  const pastReservations = reservations.filter(
    (r) => r.showtime.startTime < currentDate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rezerwacje</CardTitle>
        <CardDescription>Przeglądaj swoje rezerwacje</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
            <TabsTrigger value="past">Przeszłe</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {renderReservations(upcomingReservations, true)}
          </TabsContent>
          <TabsContent value="past">
            {renderReservations(pastReservations, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function renderReservations(
  reservations: UserReservation[],
  isUpcoming: boolean
) {
  if (reservations.length === 0) {
    return <div className="pt-4 text-center">Brak danych...</div>;
  }

  return (
    <ul className="space-y-4">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <Link
              href={`/filmy/${encodeURIComponent(reservation.showtime.movie.title)}`}
              className="text-lg font-semibold"
            >
              {reservation.showtime.movie.title}
            </Link>
            {isUpcoming && (
              <Button variant="outline" size="sm">
                <Pencil />
                Zarządzaj
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {format(reservation.showtime.startTime, "d MMMM yyyy", {
                locale: pl
              })}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {format(reservation.showtime.startTime, "HH:mm", {
                locale: pl
              })}
            </div>
            <div className="flex flex-col gap-2">
              <div>Miejsca:</div>
              <ul className="space-y-1">
                {reservation.seats.map((seat) => (
                  <li key={`${seat.rowNumber}-${seat.seatNumber}`}>
                    Rząd: {seat.rowNumber}; Miejsce: {seat.seatNumber}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
