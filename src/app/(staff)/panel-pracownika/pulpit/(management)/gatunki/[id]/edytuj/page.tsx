import { notFound } from "next/navigation";
import GenreForm from "@/components/dashboard/genres/GenreForm";
import { getGenreById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";

interface EditGenrePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGenrePage({ params }: EditGenrePageProps) {
  const { id } = await params;
  const genre = await getGenreById(id);

  if (!genre) {
    notFound();
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Edytuj gatunek</h1>
      <GenreForm
        id={genre.id}
        name={genre.name}
        ageRestriction={genre.ageRestriction.toString()}
      />
    </div>
  );
}
