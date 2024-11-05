import RoomForm from "@/app/(staff)/staff/dashboard/rooms/RoomForm";

export default function CreateRoomPage() {
  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl">Create New Room</h1>
        <RoomForm />
      </div>
    </main>
  );
}
