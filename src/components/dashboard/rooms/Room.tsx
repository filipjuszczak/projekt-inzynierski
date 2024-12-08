import RowsLabels from "@/components/dashboard/rooms/RowsLabels";
import Screen from "@/components/dashboard/rooms/Screen";
import Seats from "@/components/dashboard/rooms/Seats";
import Legend from "@/components/dashboard/rooms/Legend";

interface RoomProps {
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
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
        <RowsLabels numberOfRows={numberOfRows} />
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
