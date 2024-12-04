import RoomsTable from "@/components/dashboard/rooms/RoomsTable";
import type { Room } from "@prisma/client";

interface RoomListProps {
  rooms: Pick<Room, "id" | "number" | "numberOfRows" | "seatsPerRow">[];
}

export default function RoomList({ rooms }: RoomListProps) {
  return <RoomsTable data={rooms} />;
}
