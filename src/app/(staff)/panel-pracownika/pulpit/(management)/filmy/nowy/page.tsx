import { notFound } from "next/navigation";
import { getGenres } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";
import MovieForm from "@/components/dashboard/movies/MovieForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dodaj nowy film"
};

export default async function CreateMoviePage() {
  const genres = await getGenres();

  if (!genres) {
    notFound();
  }

  return (
    <div className="flex flex-grow items-center justify-center">
      <div className="w-96 space-y-8">
        <h1 className="text-center text-3xl font-bold">Dodaj nowy film</h1>
        <MovieForm genres={genres} />
      </div>
    </div>
  );
}
