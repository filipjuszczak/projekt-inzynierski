"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Armchair, Ban, Calendar, Clock } from "lucide-react";
import { OrderType } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservationsListSkeleton from "@/components/account/reservations/skeletons/ReservationsListSkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { useReservations } from "@/app/(main)/konto/rezerwacje/queries";
import { cancelReservation } from "@/app/(main)/konto/rezerwacje/actions";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import type { UserReservation } from "@/lib/types";

export default function ReservationsList() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { data, isLoading, isError } = useReservations();

  if (isLoading) {
    return <ReservationsListSkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
    const currentDate = new Date();

    const upcomingReservations: UserReservation[] = [];
    const pastReservations: UserReservation[] = [];

    data.reservations.forEach((r) => {
      if (new Date(r.showtime.startTime) >= currentDate) {
        upcomingReservations.push(r);
      } else {
        pastReservations.push(r);
      }
    });

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
              {renderReservations(upcomingReservations, true, queryClient)}
            </TabsContent>
            <TabsContent value="past">
              {renderReservations(pastReservations, false, queryClient)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
}

function renderReservations(
  reservations: UserReservation[],
  isUpcoming: boolean,
  queryClient: QueryClient
) {
  if (reservations.length === 0) {
    return <div className="pt-4 text-center">Brak danych...</div>;
  }

  async function handleCancelReservation(orderId: string) {
    const result = await cancelReservation(orderId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Udało się anulować rezerwację!");
      await queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } else {
      toast.error(GENERIC_ERROR_MESSAGE);
    }
  }

  return (
    <ul className="space-y-4">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="rounded-lg border p-4">
          <AlertDialog>
            <div className="mb-2 flex items-start justify-between">
              <Link
                href={`/filmy/${encodeURIComponent(reservation.showtime.movie.title)}`}
                className="text-lg font-semibold"
              >
                {reservation.showtime.movie.title}
              </Link>
              {isUpcoming && reservation.type === OrderType.RESERVATION && (
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Ban />
                    <span className="hidden md:inline">Anuluj rezerwację</span>
                  </Button>
                </AlertDialogTrigger>
              )}
            </div>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(reservation.showtime.startTime, "d MMMM yyyy", {
                    locale: pl
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(reservation.showtime.startTime, "HH:mm", {
                    locale: pl
                  })}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Armchair className="h-4 w-4 text-muted-foreground" />
                  <span>Miejsca:</span>
                </div>
                <ul className="list-inside list-disc space-y-1">
                  {reservation.seats.map((seat) => (
                    <li key={`${seat.rowNumber}-${seat.seatNumber}`}>
                      Rząd: {seat.rowNumber}; Numer: {seat.seatNumber}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Czy na pewno chcesz anulować rezerwację?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest nieodwracalna.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleCancelReservation(reservation.id)}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Anuluj rezerwację
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </li>
      ))}
    </ul>
  );
}
