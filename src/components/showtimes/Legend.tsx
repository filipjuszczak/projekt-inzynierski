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
    <div className="mt-4 text-xs text-gray-600 sm:text-sm">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {showFree && (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-sm bg-green-500" />
            <span>Dostępne</span>
          </div>
        )}
        {showSelected && (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-sm bg-primary" />
            <span>Wybrane</span>
          </div>
        )}
        {showBooked && (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-sm bg-gray-400" />
            <span>Zarezerwowane</span>
          </div>
        )}
      </div>
    </div>
  );
}
