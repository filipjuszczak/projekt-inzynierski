import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMoviesOnClient } from "@/lib/api";

export const useInfiniteFetchMovies = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return useInfiniteQuery({
    queryKey: ["movies"],
    queryFn: ({ pageParam }) => fetchMoviesOnClient(pageParam, params),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
};
