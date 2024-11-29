import MovieCard from "@/components/MovieCard";
import { getMovies } from "@/app/(main)/filmy/data";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface MovieGridProps {
  // movies: {
  //   id: string;
  //   posterUrl: string | null;
  //   title: string;
  //   releaseDate: Date;
  //   genres: string[];
  //   shortDescription: string;
  // }[];
  filters: {
    title?: string;
    genre?: string | string[];
    viewingMode?: ViewingMode | ViewingMode[];
    screenFormat?: ScreenFormat | ScreenFormat[];
  };
}

export default async function MovieGrid({ filters }: MovieGridProps) {
  const movies = await getMovies(filters);

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}
