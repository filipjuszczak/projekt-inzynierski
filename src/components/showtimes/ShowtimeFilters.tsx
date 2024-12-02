import { getShowtimeFilters } from "@/app/(main)/repertuar/data";
import Filters from "@/components/showtimes/Filters";

export default async function ShowtimeFilters() {
  const { genres, viewingModes, screenFormats } = await getShowtimeFilters();

  return (
    <Filters
      genres={genres}
      viewingModes={viewingModes}
      screenFormats={screenFormats}
    />
  );
}
