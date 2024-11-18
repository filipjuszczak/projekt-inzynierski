import ShowtimesTable from "@/components/dashboard/showtimes/ShowtimesTable";
import type { Showtime } from "@/lib/types";

interface ShowtimeListProps {
  showtimes: Showtime[];
}

export default function ShowtimeList({ showtimes }: ShowtimeListProps) {
  return <ShowtimesTable data={showtimes} />;
}
