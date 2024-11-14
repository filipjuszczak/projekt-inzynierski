import Wrapper from "@/app/(staff)/staff/dashboard/(main)/Wrapper";
import MovieList from "@/app/(staff)/staff/dashboard/(main)/movies/MovieList";

export default function MoviesPage() {
  return (
    <Wrapper>
      <h1 className="mb-8 text-3xl font-bold">Filmy</h1>
      <MovieList />
    </Wrapper>
  );
}
