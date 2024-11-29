import MovieList from "@/components/dashboard/movies/MovieList";
import { getMovies } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Filmy</h1>
      <MovieList movies={movies} />
    </div>
  );
}
