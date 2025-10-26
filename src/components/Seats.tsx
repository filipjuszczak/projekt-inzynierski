"use client";

import Seat from "@/components/Seat";
import type { BookedSeat, SelectedSeat } from "@/lib/types";

interface SeatsProps {
  showtimeId?: string;
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats?: BookedSeat[];
  selectedSeats?: SelectedSeat[];
  onSeatClick?: (rowNumber: number, seatNumber: number) => void;
}

export default function Seats({
  showtimeId,
  numberOfRows,
  seatsPerRow,
  bookedSeats,
  selectedSeats,
  onSeatClick
}: SeatsProps) {
  return (
    <div
      className="grid w-full gap-x-1 gap-y-2 md:gap-x-2 md:gap-y-6"
      style={{
        gridTemplateColumns: `repeat(${seatsPerRow},1fr)`
      }}
    >
      {generateSeats({
        numberOfRows,
        seatsPerRow,
        bookedSeats,
        selectedSeats
      }).map((seat) => {
        const key = `seat-${seat.rowNumber}-${seat.seatNumber}`;
        return (
          <Seat
            key={key}
            showtimeId={showtimeId}
            rowNumber={seat.rowNumber}
            seatNumber={seat.seatNumber}
            status={seat.status}
            selectedSeatsCount={selectedSeats?.length}
            onClick={onSeatClick}
          />
        );
      })}
    </div>
  );
}

function generateSeats({
  numberOfRows,
  seatsPerRow,
  bookedSeats,
  selectedSeats
}: {
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats?: BookedSeat[];
  selectedSeats?: SelectedSeat[];
}) {
  const seats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
    status: "free" | "booked" | "selected";
  }[] = [];

  for (let rowNumber = 1; rowNumber <= numberOfRows; rowNumber++) {
    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      const status = bookedSeats?.some(
        (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
      )
        ? "booked"
        : selectedSeats?.some(
              (seat) =>
                seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
            )
          ? "selected"
          : "free";

      seats.push({
        id: `${rowNumber}-${seatNumber}`,
        rowNumber,
        seatNumber,
        status
      });
    }
  }

  return seats;
}
