import { getFilters } from "@/app/(main)/filmy/data";
import Filters from "@/components/movies/Filters";

export default async function FilterSidebar() {
  const { genres, viewingModes, screenFormats } = await getFilters();

  return (
    <Filters
      genres={genres}
      viewingModes={viewingModes}
      screenFormats={screenFormats}
    />
  );
}
