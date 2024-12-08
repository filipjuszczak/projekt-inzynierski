"use client";

import Seat from "@/components/showtimes/Seat";
import type { SelectedSeat } from "@/components/showtimes/OrderTickets";

interface SeatsProps {
  showtimeId: string;
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
  }[];
  selectedSeats: SelectedSeat[];
  onSeatClick: (rowNumber: number, seatNumber: number) => void;
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
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`
      }}
    >
      {Array.from({ length: numberOfRows }, (_, rowIndex) =>
        Array.from({ length: seatsPerRow }, (_, seatIndex) => {
          const rowNumber = rowIndex + 1;
          const seatNumber = seatIndex + 1;
          const seatId = `seat-${rowNumber}-${seatNumber}`;
          const isBooked = bookedSeats.some(
            (bookedSeat) =>
              bookedSeat.rowNumber === rowNumber &&
              bookedSeat.seatNumber === seatNumber
          );
          const isSelected = !!selectedSeats.find(
            (seat) =>
              seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
          );
          return (
            <Seat
              key={seatId}
              showtimeId={showtimeId}
              rowNumber={rowNumber}
              seatNumber={seatNumber}
              isBooked={isBooked}
              isSelected={isSelected}
              selectedSeatsCount={selectedSeats.length}
              onClick={onSeatClick}
            />
          );
        })
      )}
    </div>
  );
}
