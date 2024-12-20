import { Suspense } from "react";
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
import ShowtimeFilters from "@/components/showtimes/ShowtimeFilters";
import ShowtimeFiltersSkeleton from "@/components/showtimes/skeletons/ShowtimeFiltersSkeleton";
import ShowtimesList from "@/components/showtimes/ShowtimesList";
import ShowtimesListSkeleton from "@/components/showtimes/skeletons/ShowtimesListSkeleton";
import type { Metadata } from "next";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

export const metadata: Metadata = {
  title: "Repertuar",
  description: "Sprawdź aktualny repertuar kinowy i wybierz coś dla siebie.",
  openGraph: {
    title: "Repertuar | Sunema",
    description: "Sprawdź aktualny repertuar kinowy i wybierz coś dla siebie."
  }
};

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
    <Drawer>
      <div className="container mx-auto flex-grow px-4 py-12 md:py-24">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 z-50 size-16 md:hidden"
          >
            <Filter />
            <span className="sr-only">Otwórz menu filtrów</span>
          </Button>
        </DrawerTrigger>
        <h1 className="mb-6 text-3xl font-bold">Repertuar</h1>
        <div className="hidden md:block">
          <Suspense fallback={<ShowtimeFiltersSkeleton />}>
            <ShowtimeFilters />
          </Suspense>
        </div>
        <Suspense fallback={<ShowtimesListSkeleton />}>
          <ShowtimesList filters={filters} />
        </Suspense>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">Menu nawigacyjne</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu nawigacyjne
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Suspense fallback={<ShowtimeFiltersSkeleton />}>
            <ShowtimeFilters />
          </Suspense>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
