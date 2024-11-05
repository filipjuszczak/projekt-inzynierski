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
