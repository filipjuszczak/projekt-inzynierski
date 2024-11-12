"use client";

import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useFetchMovies } from "@/app/(staff)/staff/dashboard/movies/queries";

export default function MovieList() {
  const { data: moviesData, isFetching } = useFetchMovies();

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {moviesData && moviesData.length === 0 && <p>No movies found...</p>}
      {moviesData && (
        <ul className="grid grid-cols-3">
          {moviesData.map((movie) => (
            <li key={movie.id}>
              <Link href={`/staff/dashboard/movies/${movie.id}/edit`}>
                <AspectRatio ratio={2 / 3} className="bg-muted">
                  {movie.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={`Plakat filmu ${movie.title}`}
                      fill
                      className="object-fit h-full w-full rounded-md"
                    />
                  ) : null}
                </AspectRatio>
                <span>{movie.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
