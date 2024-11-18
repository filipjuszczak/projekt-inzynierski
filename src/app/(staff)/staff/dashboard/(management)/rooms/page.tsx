import { notFound } from "next/navigation";
import { getRooms } from "@/app/(staff)/staff/dashboard/(management)/rooms/data";
import RoomList from "@/components/dashboard/rooms/RoomList";

export default async function RoomsPage() {
  const rooms = await getRooms();

  if (!rooms) {
    return notFound();
  }

  return (
    <div className="flex-grow">
      <h1 className="mb-8 text-3xl font-bold">Sale</h1>
      <RoomList rooms={rooms} />
    </div>
  );
}
