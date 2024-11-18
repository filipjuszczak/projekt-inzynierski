import GenreTable from "@/components/dashboard/genres/GenreTable";
import type { GenreWithMovieCount } from "@/lib/types";

interface GenreListProps {
  genres: GenreWithMovieCount[];
}

export default function GenreList({ genres }: GenreListProps) {
  return <GenreTable genres={genres} />;
}
