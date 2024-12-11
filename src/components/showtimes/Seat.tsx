"use client";

import ky from "ky";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MAX_SELECTED_SEATS } from "@/lib/constants";

interface SeatProps {
  showtimeId: string;
  rowNumber: number;
  seatNumber: number;
  status: "free" | "booked" | "selected";
  selectedSeatsCount: number;
  onClick: (rowNumber: number, seatNumber: number) => void;
}

export default function Seat({
  showtimeId,
  rowNumber,
  seatNumber,
  status,
  selectedSeatsCount,
  onClick
}: SeatProps) {
  async function handleClick() {
    if (status === "booked") {
      toast.error("To miejsce zostało zarezerwowane przez innego użytkownika.");
      return;
    }

    if (status !== "selected" && selectedSeatsCount >= MAX_SELECTED_SEATS) {
      toast.error("Możesz zarezerwować maksymalnie 5 miejsc.");
      return;
    }

    try {
      const apiEndpoint = `/api/seats/${status === "selected" ? "unlock" : "lock"}`;
      const { success } = await ky
        .post(apiEndpoint, {
          json: { showtimeId, rowNumber, seatNumber }
        })
        .json<{ success: boolean }>();

      if (success) {
        onClick(rowNumber, seatNumber);
      } else {
        toast.error(
          "To miejsce zostało zarezerwowane przez innego użytkownika."
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
        "h-4 w-full rounded-t-sm transition-colors xs:h-6 sm:rounded-t-lg md:h-10",
        status === "free" && "bg-green-500 hover:bg-green-600",
        status === "booked" && "cursor-not-allowed bg-gray-400",
        status === "selected" && "bg-primary"
      )}
      disabled={status === "booked"}
    ></button>
  );
}
