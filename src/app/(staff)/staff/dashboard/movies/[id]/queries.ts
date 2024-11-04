import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Movie } from "@/lib/types";

export const useFetchMovieById = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => ky.get(`/api/movies/${movieId}`).json<Movie>(),
    enabled: !!movieId
  });
};
