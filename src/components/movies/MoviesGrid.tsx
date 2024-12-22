"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import MoviesGridSkeleton from "@/components/skeletons/MoviesGridSkeleton";
import { PaginationWithLinks } from "@/components/ui/PaginationWithLinks";
import { useFilteredQuery } from "@/hooks/use-filtered-query";
import { FIVE_MINUTES_IN_MS, PAGE_SIZE } from "@/lib/constants";
import type { Filters, MoviesResponse } from "@/lib/types";

interface MoviesGridProps extends MoviesResponse {
  filters: Filters;
}

export default function MoviesGrid({
  movies,
  filters,
  totalCount
}: MoviesGridProps) {
  const searchParams = useSearchParams();
  const { data, isLoading, isError } = useFilteredQuery<MoviesResponse>({
    endpoint: "/api/movies",
    initialData: { movies, totalCount },
    staleTime: FIVE_MINUTES_IN_MS
  });

  if (isLoading) {
    return <MoviesGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="size-6" />
          <p>Wystąpił błąd podczas pobierania filmów.</p>
        </div>
      </div>
    );
  }

  if (data) {
    if (data.movies.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-lg font-bold text-muted-foreground">
            Brak filmów spełniających podane kryteria...
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.movies.map((movie) => (
            <MovieCard
              key={movie.id}
              sizes="(max-width: 450px) 100vw, (min-width: 640px) 50vw, (min-width: 768px) 33vw, (min-width: 1024px) 25vw, (min-width: 1280px) 20vw"
              {...movie}
            />
          ))}
        </div>
        {data.movies.length > 0 && (
          <PaginationWithLinks
            page={Number(searchParams.get("page"))}
            pageSize={PAGE_SIZE}
            totalCount={data.totalCount}
          />
        )}
      </div>
    );
  }
}
