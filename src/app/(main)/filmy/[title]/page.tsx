import { Suspense } from "react";
import { notFound } from "next/navigation";
import MovieDetails from "@/components/MovieDetails";
import UpcomingShowtimesForMovie from "@/components/UpcomingShowtimesForMovie";
import UpcomingShowtimesForMovieSkeleton from "@/components/skeletons/UpcomingShowtimesForMovieSkeleton";
import { getMovieWithExternalData } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import { Separator } from "@/components/ui/separator";

interface MoviePageProps {
  params: Promise<{ title: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);
  const movie = await getMovieWithExternalData({ title: decodedTitle });

  if (!movie) {
    notFound();
  }

  return (
    <main className="container mx-auto flex-grow items-center space-y-16 px-4 py-24 md:px-0">
      <MovieDetails
        posterUrl={movie.posterUrl || "/images/image-placeholder.svg"}
        title={movie.title}
        releaseDate={movie.releaseDate}
        duration={movie.duration}
        description={movie.description}
        genres={movie.genres}
        viewingModes={movie.viewingModes}
        screenFormats={movie.screenFormats}
        rating={movie.rating}
        director={movie.director}
        cast={movie.cast}
      />
      <Separator />
      <Suspense fallback={<UpcomingShowtimesForMovieSkeleton />}>
        <UpcomingShowtimesForMovie title={decodedTitle} />
      </Suspense>
    </main>
  );
}
