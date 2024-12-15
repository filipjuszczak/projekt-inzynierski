import { notFound } from "next/navigation";
import MovieDetails from "@/components/MovieDetails";
import UpcomingShowtimes from "@/components/dashboard/rooms/UpcomingShowtimes";
import { getMovieMetadata } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/[id]/metadata";
import { getMovieWithExternalData } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import type { Metadata } from "next";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: MovieDetailsPageProps): Promise<Metadata> {
  const id = (await params).id;
  const { title } = await getMovieMetadata(id);

  return {
    title: title ? title : "Nie znaleziono filmu"
  };
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
        sizes="(max-width: 450px) 100vw, (min-width: 450px) 60vw, (min-width: 640px) 100vw, (min-width: 768px) 70vw, (min-width: 1024px) 20vw, (min-width: 1280px) 25vw"
      />
      <UpcomingShowtimes showtimes={movie.upcomingShowtimes} />
    </div>
  );
}
