import Seat from "@/components/dashboard/rooms/Seat";

interface LegendProps {
  showFree: boolean;
  showBooked: boolean;
  showSelected: boolean;
}

export default function Legend({
  showFree,
  showBooked,
  showSelected
}: LegendProps) {
  return (
    <div className="flex flex-col gap-10 md:flex-row">
      {showFree && (
        <div className="flex items-center gap-2">
          <Seat rowNumber={null} seatNumber={null} isBooked={false} />- Wolne
        </div>
      )}
      {showBooked && (
        <div className="flex items-center gap-2">
          <Seat rowNumber={null} seatNumber={null} isBooked={true} />- Zajęte
        </div>
      )}
      {showSelected && (
        <div className="flex items-center gap-2">
          <Seat
            rowNumber={null}
            seatNumber={null}
            isBooked={false}
            isSelected={true}
          />
          - Wybrane
        </div>
      )}
    </div>
  );
}
