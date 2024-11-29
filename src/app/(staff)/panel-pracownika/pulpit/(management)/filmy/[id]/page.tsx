import { notFound } from "next/navigation";
import MovieDetails from "@/components/MovieDetails";
import UpcomingShowtimes from "@/components/dashboard/rooms/UpcomingShowtimes";
import { getMovieWithExternalData } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({
  params
}: MovieDetailsPageProps) {
  const { id } = await params;
  const movie = await getMovieWithExternalData({ id });

  if (!movie) {
    notFound();
  }

  return (
    <div className="container mx-auto flex-grow space-y-16">
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
      <UpcomingShowtimes showtimes={movie.upcomingShowtimes} />
    </div>
  );
}
