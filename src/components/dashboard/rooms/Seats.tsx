import Seat from "@/components/dashboard/rooms/Seat";

interface SeatsProps {
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
  }[];
}

export default function Seats({
  numberOfRows,
  seatsPerRow,
  bookedSeats
}: SeatsProps) {
  return (
    <div
      className="grid gap-4"
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
          return (
            <Seat
              key={seatId}
              rowNumber={rowNumber}
              seatNumber={seatNumber}
              isBooked={isBooked}
            />
          );
        })
      )}
    </div>
  );
}
