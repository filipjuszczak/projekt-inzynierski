import ky from "ky";
import type { MoviesPage } from "@/lib/types";
import { getMovies } from "@/app/(main)/filmy/data";

export async function fetchMoviesOnServer(
  pageParam: string | null,
  params: URLSearchParams
) {
  console.log("Fetching movies on server...");

  if (pageParam) {
    params.set("cursor", pageParam);
  }

  return await getMovies(params);
}

export function fetchMoviesOnClient(
  pageParam: string | null,
  params: URLSearchParams
) {
  console.log("Fetching movies on client...");

  if (pageParam) {
    params.set("cursor", pageParam);
  }

  return ky.get(`/api/movies?${params.toString()}`).json<MoviesPage>();
}
