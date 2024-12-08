import { getShowtimeFilters } from "@/app/(main)/repertuar/data";
import Filters from "@/components/showtimes/Filters";

export default async function ShowtimeFilters() {
  const { genres, movies, viewingModes, screenFormats } =
    await getShowtimeFilters();

  return (
    <Filters
      genres={genres}
      movies={movies}
      viewingModes={viewingModes}
      screenFormats={screenFormats}
    />
  );
}
