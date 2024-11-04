"use client";

import { useFetchMovies } from "@/app/(staff)/staff/dashboard/movies/queries";

export default function MovieList() {
  const { data: moviesData, isFetching } = useFetchMovies();
  console.log(moviesData);

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {moviesData && moviesData.length === 0 && <p>No movies found...</p>}
      {moviesData && (
        <ul>
          {moviesData.map((movie) => (
            <li key={movie.id}>
              <div>{movie.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
