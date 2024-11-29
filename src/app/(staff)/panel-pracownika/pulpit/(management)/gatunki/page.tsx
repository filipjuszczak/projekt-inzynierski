import GenreList from "@/components/dashboard/genres/GenreList";
import { getGenres } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Gatunki filmowe</h1>
      <GenreList genres={genres} />
    </div>
  );
}
