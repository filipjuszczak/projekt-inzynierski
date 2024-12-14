import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoviesTable from "@/components/dashboard/movies/MoviesTable";
import { getMovies } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filmy"
};

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="flex-grow space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Filmy</h1>
        <Button asChild>
          <Link href="/panel-pracownika/pulpit/filmy/nowy">
            <PlusCircle /> Nowy
          </Link>
        </Button>
      </div>
      <MoviesTable data={movies} />
    </div>
  );
}
