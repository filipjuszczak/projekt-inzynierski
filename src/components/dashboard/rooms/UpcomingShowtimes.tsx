import ShowtimeList from "@/components/dashboard/showtimes/ShowtimeList";
import type { ShowtimeData } from "@/lib/types";

interface UpcomingShowtimesProps {
  showtimes: ShowtimeData[];
}

export default function UpcomingShowtimes({
  showtimes
}: UpcomingShowtimesProps) {
  return (
    <div className="space-y-6">
      <div className="pb-4 text-3xl font-bold">Nadchodzące seanse</div>
      <ShowtimeList showtimes={showtimes} />
    </div>
  );
}
