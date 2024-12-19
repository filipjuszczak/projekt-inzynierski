import Filters from "@/components/movies/Filters";
import { getMovieFilters } from "@/app/(main)/filmy/data";

export default async function FilterSidebar() {
  const { genres, viewingModes, screenFormats } = await getMovieFilters();

  return (
    <Filters
      genres={genres}
      viewingModes={viewingModes}
      screenFormats={screenFormats}
    />
  );
}
