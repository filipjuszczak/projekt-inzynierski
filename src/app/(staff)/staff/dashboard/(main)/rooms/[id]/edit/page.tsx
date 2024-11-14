"use client";

import { useParams } from "next/navigation";
import RoomForm from "@/app/(staff)/staff/dashboard/(main)/rooms/RoomForm";

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1>Edit Room</h1>
        <RoomForm roomId={params.id} />
      </div>
    </main>
  );
}
