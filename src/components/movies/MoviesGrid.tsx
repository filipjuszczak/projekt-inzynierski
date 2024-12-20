"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { AlertCircle } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import MoviesGridSkeleton from "@/components/skeletons/MoviesGridSkeleton";
import { PaginationWithLinks } from "@/components/ui/PaginationWithLinks";
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

  const [shouldFetch, setShouldFetch] = useState(false);
  const [initialQueryKey] = useState(() => [
    "movies",
    {
      filters: Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(value);
          acc[key].sort();
          return acc;
        },
        {} as Record<string, string[]>
      )
    }
  ]);

  useEffect(() => {
    setShouldFetch(true);
  }, []);

  const currentQueryKey = [
    "movies",
    {
      filters: Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(value);
          acc[key].sort();
          return acc;
        },
        {} as Record<string, string[]>
      )
    }
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: currentQueryKey,
    queryFn: () => {
      const params = new URLSearchParams(window.location.search);
      return ky.get(`/api/movies?${params.toString()}`).json<MoviesResponse>();
    },
    initialData: () =>
      JSON.stringify(currentQueryKey) === JSON.stringify(initialQueryKey)
        ? { movies, totalCount }
        : undefined,
    enabled: shouldFetch,
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
    // const moviesToDisplay = data.movies || movies;
    // const totalCountToDisplay = data.totalCount || totalCount;

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
