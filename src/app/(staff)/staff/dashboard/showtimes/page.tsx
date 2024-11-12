import Wrapper from "@/app/(staff)/staff/dashboard/Wrapper";
import ShowtimeList from "@/app/(staff)/staff/dashboard/showtimes/ShowtimeList";

export default function ShowtimesPage() {
  return (
    <Wrapper>
      <h1>Showtimes</h1>
      <ShowtimeList />
    </Wrapper>
  );
}
