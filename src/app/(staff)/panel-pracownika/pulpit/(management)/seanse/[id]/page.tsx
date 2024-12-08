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
import MovieDetails from "@/components/MovieDetails";
import Room from "@/components/dashboard/rooms/Room";
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

  const totalSeats = showtime.room.numberOfRows * showtime.room.seatsPerRow;
  const freeSeats = totalSeats - showtime.seats.length;
  const takenSeats = showtime.seats.length;

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
              Sala numer:{" "}
              <span className="text-foreground">{showtime.room.number}</span>
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
        <div className="flex justify-center">
          <Room
            numberOfRows={showtime.room.numberOfRows}
            seatsPerRow={showtime.room.seatsPerRow}
            bookedSeats={showtime.seats}
          />
        </div>
      </div>
      <Separator />
      <MovieDetails
        posterUrl={showtime.movie.posterUrl || "/images/image-placeholder.svg"}
        title={showtime.movie.title}
        releaseDate={showtime.movie.releaseDate}
        duration={showtime.movie.duration}
        description={showtime.movie.description}
        viewingModes={showtime.movie.viewingModes}
        screenFormats={showtime.movie.screenFormats}
        genres={showtime.movie.genres}
        rating={showtime.movie.rating}
        director={showtime.movie.director}
        cast={showtime.movie.cast}
      />
    </div>
  );
}
