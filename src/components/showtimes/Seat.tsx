"use client";

import ky from "ky";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MAX_SELECTED_SEATS } from "@/lib/constants";

interface SeatProps {
  showtimeId: string;
  rowNumber: number;
  seatNumber: number;
  isBooked: boolean;
  isSelected: boolean;
  selectedSeatsCount: number;
  onClick: (rowNumber: number, seatNumber: number) => void;
}

export default function Seat({
  showtimeId,
  rowNumber,
  seatNumber,
  isBooked,
  isSelected,
  selectedSeatsCount,
  onClick
}: SeatProps) {
  async function handleClick() {
    if (isBooked) {
      toast.error("To miejsce zostało zarezerwowane przez innego użytkownika.");
      return;
    }

    // if the seat is already selected, remove it
    if (!isSelected && selectedSeatsCount >= MAX_SELECTED_SEATS) {
      toast.error("Możesz zarezerwować maksymalnie 5 miejsc.");
      return;
    }

    try {
      const apiEndpoint = `/api/seats/${isSelected ? "unlock" : "lock"}`;
      const { success } = await ky
        .post(apiEndpoint, {
          json: { showtimeId, rowNumber, seatNumber }
        })
        .json<{ success: boolean }>();

      if (success) {
        onClick(rowNumber, seatNumber);
      } else {
        toast.error(
          "To miejsce zostało zarezerwowane przez innego użytkownika. Prosimy o wybór innego."
        );
      }
    } catch (error) {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex size-5 items-center justify-center rounded-sm bg-foreground font-mono text-xs text-background",
        isBooked && "bg-muted text-white",
        isSelected && "bg-primary text-white"
      )}
      disabled={isBooked}
    >
      {seatNumber}
    </button>
  );
}
