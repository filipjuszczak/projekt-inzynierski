import { notFound } from "next/navigation";
import RoomForm from "@/components/dashboard/rooms/RoomForm";
import { getRoomById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";
import type { Metadata } from "next";
import { getRoomMetadata } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/[id]/metadata";

interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: EditRoomPageProps): Promise<Metadata> {
  const id = (await params).id;
  const { number } = await getRoomMetadata(id);

  return {
    title: number ? "Edytuj salę" : "Nie znaleziono sali"
  };
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
        id={room.room.id}
        number={room.room.number.toString()}
        numberOfRows={room.room.numberOfRows.toString()}
        seatsPerRow={room.room.seatsPerRow.toString()}
      />
    </div>
  );
}
