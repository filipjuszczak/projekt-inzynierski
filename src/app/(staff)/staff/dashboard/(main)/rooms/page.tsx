import Wrapper from "@/app/(staff)/staff/dashboard/(main)/Wrapper";
import RoomList from "@/app/(staff)/staff/dashboard/(main)/rooms/RoomList";

export default function RoomsPage() {
  return (
    <Wrapper>
      <h1 className="mb-8 text-3xl font-bold">Sale</h1>
      <RoomList />
    </Wrapper>
  );
}
