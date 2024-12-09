"use client";

import Image from "next/image";
import { MoveLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CheckoutForm from "@/components/showtimes/CheckoutForm";
import { TICKET_LABELS } from "@/lib/constants";
import type { SelectedSeat, Step } from "@/lib/types";

interface SummaryProps {
  showtime: {
    id: string;
    movie: {
      id: string;
      title: string;
      shortDescription: string;
      posterUrl: string | null;
      genres: {
        id: string;
        name: string;
      }[];
    };
    room: {
      id: string;
      numberOfRows: number;
      seatsPerRow: number;
    };
    seats: {
      id: string;
      rowNumber: number;
      seatNumber: number;
    }[];
  };
  tickets: Record<
    string,
    {
      price: number;
    }
  >;
  selectedSeats: SelectedSeat[];
  onChangeStep: (step: Step) => void;
}

export default function Summary({
  showtime,
  tickets,
  selectedSeats,
  onChangeStep
}: SummaryProps) {
  const totalPrice =
    selectedSeats.reduce(
      (acc, seat) => acc + tickets[seat.ticketType].price,
      0
    ) / 100;

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Podsumowanie</CardTitle>
        <CardDescription>
          Sprawdź swoje zamówienie przed sfinalizowaniem zakupu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[2/3] max-h-[400px] w-full max-w-[250px]">
            <Image
              src={showtime.movie.posterUrl || "/images/image-placeholder.svg"}
              alt={`Plakat filmu ${showtime.movie.title}`}
              fill
              className="aspect-[2/3] rounded-lg object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{showtime.movie.title}</h2>
            <div className="flex gap-2">
              {showtime.movie.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {showtime.movie.shortDescription}
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Wybrane miejsca</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {selectedSeats.map((seat) => (
              <li key={seat.id}>
                {TICKET_LABELS[seat.ticketType]}:{" "}
                <span>
                  Rząd: {seat.rowNumber}; Miejsce: {seat.seatNumber}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <h2 className="text-xl font-bold">Dane zamawiającego</h2>
        <CheckoutForm
          showtimeId={showtime.id}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onChangeStep("select-tickets")}
        >
          <MoveLeft />
          Wróć
        </Button>
      </CardContent>
    </Card>
  );
}
