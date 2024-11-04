import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Genre } from "@/lib/types";

export const useFetchGenreById = (genreId: string | undefined) => {
  return useQuery({
    queryKey: ["genre", genreId],
    queryFn: () => ky.get(`/api/genres/${genreId}`).json<Genre>(),
    enabled: !!genreId
  });
};
