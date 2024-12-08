import { Button } from "@/components/ui/button";
import RowsLabels from "@/components/showtimes/RowsLabels";
import Screen from "@/components/showtimes/Screen";
import Seats from "@/components/showtimes/Seats";
import Legend from "@/components/showtimes/Legend";
import type { SelectedSeat, Step } from "@/components/showtimes/OrderTickets";
import { MoveRight } from "lucide-react";

interface RoomProps {
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
  onChangeStep: (step: Step) => void;
}

export default function Room({
  showtimeId,
  numberOfRows,
  seatsPerRow,
  bookedSeats,
  selectedSeats,
  onSeatClick,
  onChangeStep
}: RoomProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <div className="flex-grow space-y-8">
        <Screen />
        <Seats
          showtimeId={showtimeId}
          numberOfRows={numberOfRows}
          seatsPerRow={seatsPerRow}
          bookedSeats={bookedSeats}
          selectedSeats={selectedSeats}
          onSeatClick={onSeatClick}
        />
        <Legend showFree showBooked showSelected />
      </div>
      <Button
        onClick={() => onChangeStep("select-tickets")}
        disabled={selectedSeats.length === 0}
      >
        Dalej
        <MoveRight />
      </Button>
    </div>
  );
}
