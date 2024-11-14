import Wrapper from "@/app/(staff)/staff/dashboard/(main)/Wrapper";
import ShowtimeList from "@/app/(staff)/staff/dashboard/(main)/showtimes/ShowtimeList";

export default function ShowtimesPage() {
  return (
    <Wrapper>
      <h1 className="mb-8 text-3xl font-bold">Seanse</h1>
      <ShowtimeList />
    </Wrapper>
  );
}
