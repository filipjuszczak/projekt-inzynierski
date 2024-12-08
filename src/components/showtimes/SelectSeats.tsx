import Room from "@/components/showtimes/Room";
import type { SelectedSeat, Step } from "@/components/showtimes/OrderTickets";

interface SelectSeatsProps {
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
  selectedSeats: SelectedSeat[];
  onSeatClick: (rowNumber: number, seatNumber: number) => void;
  onChangeStep: (step: Step) => void;
}

export default function SelectSeats({
  showtime,
  selectedSeats,
  onSeatClick,
  onChangeStep
}: SelectSeatsProps) {
  return (
    <>
      <h1 className="text-center text-3xl font-bold md:text-start">
        Wybierz miejsca
      </h1>
      <Room
        showtimeId={showtime.id}
        numberOfRows={showtime.room.numberOfRows}
        seatsPerRow={showtime.room.seatsPerRow}
        bookedSeats={showtime.seats}
        selectedSeats={selectedSeats}
        onSeatClick={onSeatClick}
        onChangeStep={onChangeStep}
      />
    </>
  );
}
