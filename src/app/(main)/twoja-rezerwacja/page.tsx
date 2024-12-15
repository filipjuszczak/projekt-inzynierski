import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarPlus, Share2, Home, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getReservation } from "@/app/(main)/twoja-rezerwacja/data";

interface YourReservationPageProps {
  searchParams: Promise<{
    id: string;
  }>;
}

export default async function YourReservationPage({
  searchParams
}: YourReservationPageProps) {
  const { id } = await searchParams;
  const reservation = await getReservation(id);

  if (!reservation) {
    notFound();
  }

  const { showtime } = reservation;

  return (
    <main className="container mx-auto flex flex-grow items-center justify-center px-4 py-24">
      <Card className="mx-auto max-w-2xl flex-grow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Dziękujemy za rezerwację!
          </CardTitle>
          <CardDescription>Twoja rezerwacja została utworzona.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-semibold">
              {showtime.movie.title}
            </h2>
            <p className="text-muted-foreground">
              Sala numer: <strong>{showtime.room.number}</strong>
            </p>
            <p className="text-muted-foreground">
              {format(showtime.startTime, "d MMMM yyyy", { locale: pl })} o{" "}
              {format(showtime.startTime, "HH:mm")}
            </p>
            <p className="text-muted-foreground">
              Liczba biletów: <strong>{showtime.seats.length}</strong>
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {showtime.seats.map((seat, index) => (
              <Fragment key={seat.id}>
                <div className="text-muted-foreground">
                  Rząd: {seat.rowNumber}; Miejsce: {seat.seatNumber}
                </div>
                <div
                  key={seat.id}
                  className="flex h-48 w-48 items-center justify-center bg-muted"
                >
                  <Ticket className="h-24 w-24" />
                  <span className="sr-only">Kod QR biletu</span>
                </div>
              </Fragment>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Pokaż kod(y) QR w kasie kinowej.
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
            <Button variant="outline" className="w-fit">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Dodaj do kalendarza
            </Button>
            <Button variant="outline" className="w-fit">
              <Share2 className="mr-2 h-4 w-4" />
              Udostępnij
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/">
            <Button variant="ghost">
              <Home className="mr-2 h-4 w-4" />
              Wróć na stronę główną
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
