import Wrapper from "@/app/(staff)/staff/dashboard/(main)/Wrapper";
import GenreList from "@/app/(staff)/staff/dashboard/(main)/genres/GenreList";

export default function GenresPage() {
  return (
    <Wrapper>
      <h1 className="mb-8 text-3xl font-bold">Gatunki filmowe</h1>
      <GenreList />
    </Wrapper>
  );
}
