import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { Movie } from "@/lib/types";

export const useFetchMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => ky.get("/api/movies").json<Movie[]>(),
    refetchOnWindowFocus: false
  });
};
