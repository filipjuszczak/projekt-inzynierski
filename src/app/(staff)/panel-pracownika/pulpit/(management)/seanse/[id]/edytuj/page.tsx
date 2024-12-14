import { notFound } from "next/navigation";
import ShowtimeForm from "@/components/dashboard/showtimes/ShowtimeForm";
import { getShowtimeById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/data";
import { getMoviesPromise } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import { getRoomsPromise } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";
import { getShowtimeMetadata } from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/[id]/metadata";
import type { Metadata } from "next";

interface EditShowtimePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: EditShowtimePageProps): Promise<Metadata> {
  const id = (await params).id;
  const { id: showtimeId } = await getShowtimeMetadata(id);

  return {
    title: showtimeId ? "Edytuj seans" : "Nie znaleziono seansu"
  };
}

export default async function EditShowtimePage({
  params
}: EditShowtimePageProps) {
  const { id } = await params;
  const [showtime, movies, rooms] = await Promise.all([
    getShowtimeById(id, { fetchExternalData: false }),
    getMoviesPromise(),
    getRoomsPromise()
  ]);

  if (!showtime || !movies || !rooms) {
    notFound();
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Edytuj seans</h1>
      <ShowtimeForm
        id={showtime.id}
        movieId={showtime.movie.id}
        roomId={showtime.room.id}
        startTime={showtime.startTime}
        movies={movies}
        rooms={rooms}
        viewingMode={showtime.viewingMode}
        screenFormat={showtime.screenFormat}
      />
    </div>
  );
}
