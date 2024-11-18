import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Armchair, Ban, Check, Clock, Clock10, Sigma } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MovieDetails from "@/components/MovieDetails";
import Room from "@/components/dashboard/rooms/Room";
import { getShowtimeById } from "@/app/(staff)/staff/dashboard/(management)/showtimes/data";

interface ShowtimeDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowtimeDetailsPage({
  params
}: ShowtimeDetailsPageProps) {
  const { id } = await params;
  const showtime = await getShowtimeById(id);

  if (!showtime) {
    notFound();
  }

  const totalSeats = showtime.room.numberOfRows * showtime.room.seatsPerRow;
  const freeSeats = totalSeats - showtime.seats.length;
  const takenSeats = showtime.seats.length;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">O seansie</h1>
          <div className="space-y-2">
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
        <Room
          numberOfRows={showtime.room.numberOfRows}
          seatsPerRow={showtime.room.seatsPerRow}
          bookedSeats={showtime.seats}
        />
      </div>
      <Separator />
      <MovieDetails
        posterUrl={showtime.movie.posterUrl || "/images/image-placeholder.svg"}
        title={showtime.movie.title}
        releaseDate={showtime.movie.releaseDate}
        duration={showtime.movie.duration}
        description={showtime.movie.description}
        genres={showtime.movie.genres}
        rating={showtime.movie.rating}
        director={showtime.movie.director}
        cast={showtime.movie.cast}
      />
    </div>
  );
}
