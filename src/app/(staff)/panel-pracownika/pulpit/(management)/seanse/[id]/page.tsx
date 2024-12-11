import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  Armchair,
  Ban,
  Check,
  Clock,
  Clock10,
  Headphones,
  Monitor,
  Sigma
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Room from "@/components/Room";
import MovieDetails from "@/components/MovieDetails";
import { getShowtimeById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/data";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";

interface ShowtimeDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowtimeDetailsPage({
  params
}: ShowtimeDetailsPageProps) {
  const { id } = await params;
  const showtime = await getShowtimeById(id, { fetchExternalData: true });

  if (!showtime) {
    notFound();
  }

  const { movie, room, seats } = showtime;

  const totalSeats = room.numberOfRows * room.seatsPerRow;
  const freeSeats = totalSeats - seats.length;
  const takenSeats = seats.length;

  return (
    <div className="container mx-auto mb-24 space-y-24">
      <div className="flex flex-col items-center gap-y-16 2xl:flex-row 2xl:justify-center 2xl:gap-24">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">O seansie</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Headphones className="size-4" />
              Rodzaj audio:{" "}
              <span className="text-foreground">
                {VIEWING_MODE_LABELS[showtime.viewingMode]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Monitor className="size-4" />
              Format ekranu:{" "}
              <span className="text-foreground">
                {SCREEN_FORMAT_LABELS[showtime.screenFormat]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              Data rozpoczęcia:{" "}
              <span className="text-foreground">
                {format(showtime.startTime, "dd.MM.yyyy HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock10 className="size-4" />
              Data zakończenia:{" "}
              <span className="text-foreground">
                {format(showtime.endTime, "dd.MM.yyyy HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Armchair className="size-4" />
              Sala numer: <span className="text-foreground">{room.number}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sigma className="size-4" />
              Miejsc łącznie:{" "}
              <span className="text-foreground">{totalSeats}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ban className="size-4" />
              Miejsc zajętych:{" "}
              <span className="text-foreground">{takenSeats}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="size-4" />
              Miejsc wolnych:{" "}
              <span className="text-foreground">{freeSeats}</span>
            </div>
          </div>
        </div>
        <Room
          numberOfRows={room.numberOfRows}
          seatsPerRow={room.seatsPerRow}
          bookedSeats={seats}
        />
      </div>
      <Separator />
      <MovieDetails
        posterUrl={movie.posterUrl || "/images/image-placeholder.svg"}
        title={movie.title}
        releaseDate={movie.releaseDate}
        duration={movie.duration}
        description={movie.description}
        viewingModes={movie.viewingModes}
        screenFormats={movie.screenFormats}
        genres={movie.genres}
        rating={movie.rating}
        director={movie.director}
        cast={movie.cast}
      />
    </div>
  );
}
