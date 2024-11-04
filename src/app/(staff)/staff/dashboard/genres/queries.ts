import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Genre } from "@/lib/types";

export const useFetchGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => ky.get("/api/genres").json<Genre[]>()
  });
};
