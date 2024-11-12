import Wrapper from "@/app/(staff)/staff/dashboard/Wrapper";
import GenreList from "@/app/(staff)/staff/dashboard/genres/GenreList";

export default function GenresPage() {
  return (
    <Wrapper>
      <h1>Genres</h1>
      <GenreList />
    </Wrapper>
  );
}
