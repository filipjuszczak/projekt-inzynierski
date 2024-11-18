import { cn } from "@/lib/utils";

interface RoomProps {
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
    isBooked: boolean;
  }[];
}

export default function Room({
  numberOfRows,
  seatsPerRow,
  bookedSeats
}: RoomProps) {
  return (
    <div className="max-w-screen max-h-screen overflow-auto">
      <div className="flex space-x-4">
        <RowLabels numberOfRows={numberOfRows} />
        <div className="flex-grow">
          <div className="flex flex-col items-center space-y-8">
            <Screen />
            <Seats
              numberOfRows={numberOfRows}
              seatsPerRow={seatsPerRow}
              bookedSeats={bookedSeats}
            />
            <Legend showFree={true} showBooked={true} showSelected={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface RowLabelsProps {
  numberOfRows: number;
}

function RowLabels({ numberOfRows }: RowLabelsProps) {
  return (
    <div
      className="flex flex-col items-end justify-start pt-[4.9rem] font-medium text-muted-foreground"
      aria-hidden="true"
    >
      {Array.from({ length: numberOfRows }, (_, index) => (
        <div
          key={`row-label-${index + 1}`}
          className="flex h-12 items-center text-sm"
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

function Screen() {
  return (
    <div className="w-full rounded-md bg-secondary p-4 text-center text-secondary-foreground">
      Ekran
    </div>
  );
}

interface SeatProps {
  seatNumber: number | null;
  isBooked: boolean;
  isSelected?: boolean;
}

function Seat({ seatNumber, isBooked, isSelected }: SeatProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-sm bg-foreground font-mono text-xs text-background",
        isBooked && "bg-muted text-white",
        isSelected && "bg-primary text-white"
      )}
    >
      {seatNumber}
    </div>
  );
}

interface SeatsProps {
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
    isBooked: boolean;
  }[];
}

function Seats({ numberOfRows, seatsPerRow, bookedSeats }: SeatsProps) {
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
          const seatId = `${rowNumber}-${seatNumber}`;
          const isBooked = bookedSeats.some(
            (bookedSeat) =>
              bookedSeat.rowNumber === rowNumber &&
              bookedSeat.seatNumber === seatNumber
          );
          return (
            <Seat key={seatId} seatNumber={seatNumber} isBooked={isBooked} />
          );
        })
      )}
    </div>
  );
}

interface LegendProps {
  showFree: boolean;
  showBooked: boolean;
  showSelected: boolean;
}

function Legend({ showFree, showBooked, showSelected }: LegendProps) {
  return (
    <div className="flex gap-10">
      {showFree && (
        <div className="flex items-center gap-2">
          <Seat seatNumber={null} isBooked={false} />- Wolne
        </div>
      )}
      {showBooked && (
        <div className="flex items-center gap-2">
          <Seat seatNumber={null} isBooked={true} />- Zajęte
        </div>
      )}
      {showSelected && (
        <div className="flex items-center gap-2">
          <Seat seatNumber={null} isBooked={false} isSelected={true} />- Wybrane
        </div>
      )}
    </div>
  );
}
