import RoomForm from "@/components/dashboard/rooms/RoomForm";

export default function CreateRoomPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Utwórz salę</h1>
      <RoomForm />
    </div>
  );
}
