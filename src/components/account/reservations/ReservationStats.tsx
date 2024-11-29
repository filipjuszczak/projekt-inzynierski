import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getSessionCookie } from "@/lib/session";
import { Ticket, Calendar, Clapperboard } from "lucide-react";
import { authenticateUser } from "@/auth";
import { getReservationsStats } from "@/app/(main)/konto/data";

export default async function ReservationStats() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/logowanie");
  }

  const { allReservations, favoriteGenre } = await getReservationsStats(
    user.id
  );

  const currentDate = new Date();

  const upcomingShowtimes = allReservations.filter(
    (reservation) => reservation.showtime.startTime > currentDate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie rezerwacji</CardTitle>
        <CardDescription>Twoja aktywność w skrócie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Ticket className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Liczba rezerwacji: {allReservations.length}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Nadchodzące seanse: {upcomingShowtimes.length}
            </span>
          </div>
          <div className="flex items-center">
            <Clapperboard className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Ulubiony gatunek: {favoriteGenre || "brak"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
