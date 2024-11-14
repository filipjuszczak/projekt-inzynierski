"use client";

import { useParams } from "next/navigation";
import GenreForm from "@/app/(staff)/staff/dashboard/(main)/genres/GenreForm";

export default function EditGenrePage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1>Edit Genre</h1>
        <GenreForm genreId={params.id} />
      </div>
    </main>
  );
}
