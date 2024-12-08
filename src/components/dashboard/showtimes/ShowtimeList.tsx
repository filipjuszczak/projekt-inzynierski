import ShowtimesTable from "@/components/dashboard/showtimes/ShowtimesTable";
import type { ShowtimeData } from "@/lib/types";

interface ShowtimeListProps {
  showtimes: ShowtimeData[];
}

export default function ShowtimeList({ showtimes }: ShowtimeListProps) {
  return <ShowtimesTable data={showtimes} />;
}
