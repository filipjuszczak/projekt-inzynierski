import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import MovieDetails from "@/components/MovieDetails";
import UpcomingShowtimesForMovie from "@/components/UpcomingShowtimesForMovie";
import UpcomingShowtimesForMovieSkeleton from "@/components/skeletons/UpcomingShowtimesForMovieSkeleton";
import { getMovieMetadata } from "@/app/(main)/filmy/[title]/metadata";
import { getMovieWithExternalData } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/data";
import type { Metadata } from "next";

interface MoviePageProps {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({
  params
}: MoviePageProps): Promise<Metadata> {
  const title = (await params).title;
  const decodedTitle = decodeURIComponent(title);
  const { description, posterUrl } = await getMovieMetadata(decodedTitle);

  return {
    title: description ? decodedTitle : "Nie znaleziono filmu",
    description: description
      ? description
      : "Nie znaleziono filmu o podanym tytule.",
    openGraph: {
      title: description
        ? `${decodedTitle} | Sunema`
        : "Nie znaleziono filmu | Sunema",
      description: description
        ? description
        : "Nie znaleziono filmu o podanym tytule.",
      images: [
        {
          url: posterUrl || "/images/image-placeholder.svg",
          width: 400,
          height: 600,
          alt: posterUrl ? `Plakat filmu ${decodedTitle}` : "Obraz zastępczy"
        }
      ]
    }
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);
  const movie = await getMovieWithExternalData({ title: decodedTitle });

  if (!movie) {
    notFound();
  }

  return (
    <main className="flex-grow items-center space-y-16 px-4 py-24">
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
        sizes="(max-width: 450px) 100vw, (min-width: 450px) 60vw, (min-width: 640px) 100vw, (min-width: 1024px) 30vw"
      />
      <Separator />
      <Suspense fallback={<UpcomingShowtimesForMovieSkeleton />}>
        <UpcomingShowtimesForMovie title={decodedTitle} />
      </Suspense>
    </main>
  );
}
