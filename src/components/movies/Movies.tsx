import MoviesGrid from "@/components/movies/MoviesGrid";
import { getMovies } from "@/app/(main)/filmy/data";
import type { Filters } from "@/lib/types";

interface MoviesProps {
  filters: Filters;
}

export default async function Movies({ filters }: MoviesProps) {
  const { movies, totalCount } = await getMovies(filters);

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-xl font-bold">
          Nie znaleziono filmów dla podanych kryteriów.
        </p>
      </div>
    );
  }

  return (
    <MoviesGrid movies={movies} filters={filters} totalCount={totalCount} />
  );
}
