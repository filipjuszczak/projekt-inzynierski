import MovieCard from "@/components/MovieCard";
import { PaginationWithLinks } from "@/components/ui/PaginationWithLinks";
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
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      {movies.length > 0 && (
        <PaginationWithLinks
          page={Number(filters.page)}
          pageSize={8}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
