import ShowtimeList from "@/components/dashboard/showtimes/ShowtimeList";
import { getShowtimes } from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/data";

export default async function ShowtimesPage() {
  const showtimes = await getShowtimes();

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Seanse</h1>
      <ShowtimeList showtimes={showtimes} />
    </div>
  );
}
