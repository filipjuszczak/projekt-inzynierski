import { notFound } from "next/navigation";
import RoomForm from "@/components/dashboard/rooms/RoomForm";
import { getRoomById } from "@/app/(staff)/staff/dashboard/(management)/rooms/data";

interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Edytuj salę</h1>
      <RoomForm
        id={room.id}
        number={room.number.toString()}
        numberOfRows={room.numberOfRows.toString()}
        seatsPerRow={room.seatsPerRow.toString()}
      />
    </div>
  );
}
