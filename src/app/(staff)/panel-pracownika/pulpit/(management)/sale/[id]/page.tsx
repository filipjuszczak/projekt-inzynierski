import { notFound } from "next/navigation";
import { Columns2, Rows2, Sigma } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Room from "@/components/Room";
import UpcomingShowtimes from "@/components/dashboard/rooms/UpcomingShowtimes";
import { getRoomById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";

interface RoomDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailsPage({
  params
}: RoomDetailsPageProps) {
  const { id } = await params;
  const roomData = await getRoomById(id);

  if (!roomData) {
    return notFound();
  }

  const { room, upcomingShowtimes } = roomData;
  const totalSeats = room.numberOfRows * room.seatsPerRow;

  return (
    <div className="container mx-auto flex-grow space-y-24 2xl:grid 2xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] 2xl:gap-x-16 2xl:space-y-0">
      <div className="flex flex-col items-center gap-y-16">
        <div>
          <h1 className="pb-8 text-3xl font-bold">Sala numer {room.number}</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Rows2 className="size-4" />
              Liczba rzędów:{" "}
              <span className="text-foreground">{room.numberOfRows}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Columns2 className="size-4" />
              Liczba miejsc w rzędzie:{" "}
              <span className="text-foreground">{room.seatsPerRow}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sigma className="size-4" />
              Miejsc łącznie:{" "}
              <span className="text-foreground">{totalSeats}</span>
            </div>
          </div>
        </div>
        <Room numberOfRows={room.numberOfRows} seatsPerRow={room.seatsPerRow} />
      </div>
      <Separator orientation="vertical" className="justify-self-center" />
      <UpcomingShowtimes showtimes={upcomingShowtimes} />
    </div>
  );
}
