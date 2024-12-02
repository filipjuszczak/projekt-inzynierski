"use client";

import MovieCard from "@/components/MovieCard";
import { useInfiniteFetchMovies } from "@/app/(main)/filmy/queries";
import type { ScreenFormat, ViewingMode } from "@prisma/client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

interface MoviesProps {
  movies: {
    genres: string[];
    viewingModes: ViewingMode[];
    screenFormats: ScreenFormat[];
    id: string;
    title: string;
    shortDescription: string;
    releaseDate: Date;
    duration: number;
    posterUrl: string | null;
  }[];
}

export default function Movies() {
  const { data, hasNextPage, isFetching, fetchNextPage } =
    useInfiniteFetchMovies();

  const movies = data?.pages.flatMap((page) => page.movies) || [];

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
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </InfiniteScrollContainer>
    </div>
  );
}
