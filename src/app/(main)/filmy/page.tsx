import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Filter } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/movies/SearchBar";
import FilterSidebar from "@/components/movies/FilterSidebar";
import FilterSidebarSkeleton from "@/components/movies/skeletons/FilterSidebarSkeleton";
import Movies from "@/components/movies/Movies";
import MovieGridSkeleton from "@/components/skeletons/MovieGridSkeleton";
import type { ScreenFormat, ViewingMode } from "@prisma/client";
import type { MoviesPage } from "@/lib/types";

interface MoviesPageProps {
  searchParams: Promise<{
    page?: string;
    title?: string;
    genre?: string | string[];
    viewingMode?: ViewingMode | ViewingMode[];
    screenFormat?: ScreenFormat | ScreenFormat[];
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const filters = await searchParams;

  if (!filters.page) {
    const params = new URLSearchParams(
      Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.join(",");
          } else if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      )
    );
    params.set("page", "1");
    redirect(`/filmy?${params.toString()}`);
  }

  return (
    <Drawer>
      <div className="flex-1 px-4 py-10 lg:py-24">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 z-50 size-16 md:hidden"
          >
            <Filter />
            <span className="sr-only">Otwórz menu filtrów</span>
          </Button>
        </DrawerTrigger>
        <h1 className="mb-8 text-3xl font-bold">Filmy</h1>
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="hidden h-fit w-full md:sticky md:top-16 md:block md:w-64">
            <div className="mb-4">
              <SearchBar />
            </div>
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>
          </aside>
          <main className="flex-1">
            <Suspense fallback={<MovieGridSkeleton />}>
              <Movies filters={filters} />
            </Suspense>
          </main>
        </div>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">Menu nawigacyjne</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu nawigacyjne
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebar />
          </Suspense>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
