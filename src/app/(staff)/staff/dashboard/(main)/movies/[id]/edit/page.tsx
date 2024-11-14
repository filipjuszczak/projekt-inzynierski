"use client";

import { useParams } from "next/navigation";
import MovieForm from "@/app/(staff)/staff/dashboard/(main)/movies/MovieForm";

export default function EditMoviePage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl">Edit Movie</h1>
        <MovieForm movieId={params.id} />
      </div>
    </main>
  );
}
