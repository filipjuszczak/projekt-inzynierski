import { Suspense } from "react";
import ShowtimeFilters from "@/components/showtimes/ShowtimeFilters";
import ShowtimeFiltersSkeleton from "@/components/showtimes/skeletons/ShowtimeFiltersSkeleton";
import ShowtimesList from "@/components/showtimes/ShowtimesList";
import ShowtimesListSkeleton from "@/components/showtimes/skeletons/ShowtimesListSkeleton";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface ShowtimesPage {
  searchParams: Promise<{
    date?: string;
    title?: string;
    genre?: string;
    viewingMode?: ViewingMode;
    screenFormat?: ScreenFormat;
  }>;
}

export default async function ShowtimesPage({ searchParams }: ShowtimesPage) {
  const filters = await searchParams;

  return (
    <div className="container mx-auto flex-grow px-4 py-24">
      <h1 className="mb-6 text-3xl font-bold">Repertuar</h1>
      <Suspense fallback={<ShowtimeFiltersSkeleton />}>
        <ShowtimeFilters />
      </Suspense>
      <Suspense fallback={<ShowtimesListSkeleton />}>
        <ShowtimesList filters={filters} />
      </Suspense>
    </div>
  );
}
