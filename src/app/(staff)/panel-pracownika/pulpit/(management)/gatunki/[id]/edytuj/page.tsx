import { notFound } from "next/navigation";
import GenreForm from "@/components/dashboard/genres/GenreForm";
import { getGenreById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/data";
import type { Metadata } from "next";
import { getGenreMetadata } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/[id]/edytuj/metadata";

interface EditGenrePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: EditGenrePageProps): Promise<Metadata> {
  const id = (await params).id;
  const { name } = await getGenreMetadata(id);

  return {
    title: name ? name : "Nie znaleziono gatunku"
  };
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
