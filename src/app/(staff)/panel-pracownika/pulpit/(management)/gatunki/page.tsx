import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenreList from "@/components/dashboard/genres/GenreList";
import { getGenres } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="flex-grow space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Gatunki filmowe</h1>
        <Button asChild>
          <Link href="/panel-pracownika/pulpit/gatunki/nowy">
            <PlusCircle />
            Nowy
          </Link>
        </Button>
      </div>
      <GenreList genres={genres} />
    </div>
  );
}
