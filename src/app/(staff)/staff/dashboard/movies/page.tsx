import Wrapper from "@/app/(staff)/staff/dashboard/Wrapper";
import MovieList from "@/app/(staff)/staff/dashboard/movies/MovieList";

export default function MoviesPage() {
  return (
    <Wrapper>
      <h1>Movies</h1>
      <MovieList />
    </Wrapper>
  );
}
