import RoomsTable from "@/components/dashboard/rooms/RoomsTable";
import type { Room } from "@/lib/types";

interface RoomListProps {
  rooms: Room[];
}

export default function RoomList({ rooms }: RoomListProps) {
  return <RoomsTable data={rooms} />;
}
