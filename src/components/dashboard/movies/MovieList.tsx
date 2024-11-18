import MoviesTable from "@/components/dashboard/movies/MoviesTable";
import type { Movie } from "@/lib/types";

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  return <MoviesTable data={movies} />;
}
