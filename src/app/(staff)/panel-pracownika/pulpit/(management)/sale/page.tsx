import { getRooms } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";
import RoomList from "@/components/dashboard/rooms/RoomList";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="flex-grow">
      <h1 className="mb-8 text-3xl font-bold">Sale</h1>
      <RoomList rooms={rooms} />
    </div>
  );
}
