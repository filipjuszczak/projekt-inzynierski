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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/(main)/seans/[id]/actions";
import { useCheckAuth } from "@/app/(main)/queries";
import { TICKET_LABELS } from "@/lib/constants";
import type { SelectedSeat, Step } from "@/components/showtimes/OrderTickets";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const { data } = useCheckAuth();

  const totalPrice =
    selectedSeats.reduce(
      (acc, seat) => acc + tickets[seat.ticketType].price,
      0
    ) / 100;

  return (
    <Dialog>
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
                src={
                  showtime.movie.posterUrl || "/images/image-placeholder.svg"
                }
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
          <div className="text-xl font-bold">Łącznie: {totalPrice} PLN</div>
          <div className="flex flex-col gap-4">
            {data?.isAuthenticated ? (
              <Button
                onClick={() =>
                  createCheckoutSession({
                    showtimeId: showtime.id,
                    selectedSeats
                  })
                }
                disabled={selectedSeats.length === 0}
              >
                Kup bilety online
              </Button>
            ) : (
              <DialogTrigger asChild>
                <Button disabled={selectedSeats.length === 0}>
                  Kup bilety online
                </Button>
              </DialogTrigger>
            )}
            <Button variant="secondary" disabled={selectedSeats.length === 0}>
              Zarezerwuj miejsca
            </Button>
            <Button
              variant="outline"
              onClick={() => onChangeStep("select-tickets")}
            >
              <MoveLeft />
              Wróć
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
