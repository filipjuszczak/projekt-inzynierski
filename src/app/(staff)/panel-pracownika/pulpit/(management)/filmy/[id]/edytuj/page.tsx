import { notFound } from "next/navigation";
import MovieForm from "@/components/dashboard/movies/MovieForm";
import { getMovieById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import { getGenres } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edytuj film"
};

interface EditMoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const [movie, genres] = await Promise.all([getMovieById(id), getGenres()]);

  if (!movie || !genres) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Edytuj film</h1>
        <MovieForm
          id={movie.id}
          title={movie.title}
          description={movie.description}
          shortDescription={movie.shortDescription}
          releaseDate={movie.releaseDate}
          duration={movie.duration.toString()}
          viewingModes={movie.viewingModes.map((mode) => mode.viewingMode)}
          screenFormats={movie.screenFormats.map(
            (format) => format.screenFormat
          )}
          selectedGenres={movie.genres}
          genres={genres}
        />
      </div>
    </div>
  );
}
