import { Suspense } from "react";
import SearchBar from "@/components/movies/SearchBar";
import FilterSidebar from "@/components/movies/FilterSidebar";
import MovieGrid from "@/components/MovieGrid";
import MovieGridSkeleton from "@/components/skeletons/MovieGridSkeleton";
import FilterSidebarSkeleton from "@/components/movies/skeletons/FilterSidebarSkeleton";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

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
  console.log("Filters:", filters);

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
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGrid filters={filters} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
