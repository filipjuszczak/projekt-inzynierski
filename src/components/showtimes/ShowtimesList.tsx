import Showtimes from "@/components/showtimes/Showtimes";
import { getShowtimes } from "@/app/(main)/repertuar/data";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface ShowtimesListProps {
  filters: {
    date?: string;
    title?: string;
    genre?: string;
    viewingMode?: ViewingMode;
    screenFormat?: ScreenFormat;
  };
}

export default async function ShowtimesList({ filters }: ShowtimesListProps) {
  const showtimes = await getShowtimes(filters);
  const showtimesByMovies = Object.entries(showtimes);

  if (showtimesByMovies.length === 0) {
    return (
      <div className="text-center text-lg font-bold text-muted-foreground">
        Brak wyników wyszukiwania dla podanych kryteriów.
      </div>
    );
  }

  return <Showtimes showtimes={showtimes} />;
}
