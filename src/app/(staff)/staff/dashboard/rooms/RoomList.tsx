"use client";

import { useFetchRooms } from "@/app/(staff)/staff/dashboard/rooms/queries";

export default function RoomList() {
  const { data: roomsData, isPending } = useFetchRooms();

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {roomsData && (
        <ul>
          {roomsData.map((room) => (
            <li key={room.id}>Room no. {room.number}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
