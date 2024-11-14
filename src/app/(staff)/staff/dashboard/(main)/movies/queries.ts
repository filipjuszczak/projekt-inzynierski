import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { MovieWithGenres, EditMovieValues } from "@/lib/types";

export const useFetchMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => ky.get("/api/movies").json<MovieWithGenres[]>()
  });
};

export const useFetchMovieById = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => ky.get(`/api/movies/${movieId}`).json<EditMovieValues>(),
    enabled: !!movieId
  });
};
