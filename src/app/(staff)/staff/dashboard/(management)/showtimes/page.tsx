import { notFound } from "next/navigation";
import ShowtimeList from "@/components/dashboard/showtimes/ShowtimeList";
import { getShowtimes } from "@/app/(staff)/staff/dashboard/(management)/showtimes/data";

export default async function ShowtimesPage() {
  const showtimes = await getShowtimes();

  if (!showtimes) {
    notFound();
  }

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Seanse</h1>
      <ShowtimeList showtimes={showtimes} />
    </div>
  );
}
