"use client";

import { useFetchMovies } from "@/app/(staff)/staff/dashboard/movies/queries";
import Link from "next/link";

export default function MovieList() {
  const { data: moviesData, isFetching } = useFetchMovies();

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {moviesData && moviesData.length === 0 && <p>No movies found...</p>}
      {moviesData && (
        <ul>
          {moviesData.map((movie) => (
            <li key={movie.id}>
              <Link href={`/staff/dashboard/movies/${movie.id}/edit`}>
                {movie.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
