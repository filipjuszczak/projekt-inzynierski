import { notFound } from "next/navigation";
import MovieList from "@/components/dashboard/movies/MovieList";
import { getMovies } from "@/app/(staff)/staff/dashboard/(management)/movies/data";

export default async function MoviesPage() {
  const movies = await getMovies();

  if (!movies) {
    notFound();
  }

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Filmy</h1>
      <MovieList movies={movies} />
    </div>
  );
}
