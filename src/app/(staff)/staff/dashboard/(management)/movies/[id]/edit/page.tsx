import { notFound } from "next/navigation";
import MovieForm from "@/components/dashboard/movies/MovieForm";
import { getMovieById } from "@/app/(staff)/staff/dashboard/(management)/movies/data";
import { getGenres } from "@/app/(staff)/staff/dashboard/(management)/genres/data";

interface EditMoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const movie = await getMovieById(id);
  const genres = await getGenres();

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
          releaseDate={movie.releaseDate}
          duration={movie.duration.toString()}
          selectedGenres={movie.genres}
          genres={genres}
        />
      </div>
    </div>
  );
}
