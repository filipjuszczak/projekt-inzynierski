import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Movie, EditMovieValues } from "@/lib/types";

export const useFetchMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => ky.get("/api/movies").json<Movie[]>()
  });
};

export const useFetchMovieById = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => ky.get(`/api/movies/${movieId}`).json<EditMovieValues>(),
    enabled: !!movieId
  });
};

export const useFetchMovieData = (movieTitle: string) => {
  return useQuery({
    queryKey: ["movie-data", movieTitle],
    queryFn: () =>
      ky
        .get(
          `http://img.omdbapi.com/?apikey=${process.env.MOVIE_DB_API_KEY}&t=${movieTitle}`
        )
        .json<{ Title: string; Director: string; Actors: string[] }>()
  });
};
