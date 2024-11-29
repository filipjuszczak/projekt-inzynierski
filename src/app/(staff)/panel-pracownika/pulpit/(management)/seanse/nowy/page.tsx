import { notFound } from "next/navigation";
import ShowtimeForm from "@/components/dashboard/showtimes/ShowtimeForm";
import { getMoviesPromise } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import { getRoomsPromise } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";

export default async function CreateShowtimePage() {
  const [movies, rooms] = await Promise.all([
    getMoviesPromise(),
    getRoomsPromise()
  ]);

  if (!movies || !rooms) {
    return notFound();
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Dodaj seans</h1>
      <ShowtimeForm movies={movies} rooms={rooms} />
    </div>
  );
}
