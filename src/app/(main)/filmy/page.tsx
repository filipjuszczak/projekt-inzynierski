import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SearchBar from "@/components/movies/SearchBar";
import FilterSidebar from "@/components/movies/FilterSidebar";
import FilterSidebarSkeleton from "@/components/movies/skeletons/FilterSidebarSkeleton";
import Movies from "@/components/movies/Movies";
// import { getMovies } from "@/app/(main)/filmy/data";
import { fetchMoviesOnServer } from "@/lib/api";
import { getQueryClient } from "@/lib/get-query-client";
import type { ScreenFormat, ViewingMode } from "@prisma/client";
import type { MoviesPage } from "@/lib/types";

interface MoviesPageProps {
  searchParams: Promise<{
    title?: string;
    genre?: string | string[];
    viewingMode?: ViewingMode | ViewingMode[];
    screenFormat?: ScreenFormat | ScreenFormat[];
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const filters = await searchParams;
  const queryClient = getQueryClient();

  const params = new URLSearchParams(
    Object.entries(filters).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => acc.append(key, v));
      } else if (value !== undefined) {
        acc.append(key, value);
      }
      return acc;
    }, new URLSearchParams())
  );

  // const { movies, nextCursor } = await getMovies(filters);

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["movies"],
    queryFn: ({ pageParam }) => fetchMoviesOnServer(pageParam, params),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: MoviesPage) => lastPage.nextCursor
  });

  return (
    <div className="flex-1 px-4 py-10 lg:py-24">
      <h1 className="mb-8 text-3xl font-bold">Filmy</h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64">
          <div className="mb-4">
            <SearchBar />
          </div>
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebar />
          </Suspense>
        </aside>
        <main className="flex-1">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Movies />
          </HydrationBoundary>
        </main>
      </div>
    </div>
  );
}
