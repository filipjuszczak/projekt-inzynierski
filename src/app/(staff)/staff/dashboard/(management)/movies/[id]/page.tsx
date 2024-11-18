import { notFound } from "next/navigation";
import MovieDetails from "@/components/MovieDetails";
import { getMovieWithExternalData } from "@/app/(staff)/staff/dashboard/(management)/movies/data";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({
  params
}: MovieDetailsPageProps) {
  const { id } = await params;
  const movie = await getMovieWithExternalData(id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="container mx-auto flex-grow">
      <MovieDetails
        posterUrl={movie.posterUrl || "/images/image-placeholder.svg"}
        title={movie.title}
        releaseDate={movie.releaseDate}
        duration={movie.duration}
        description={movie.description}
        genres={movie.genres}
        rating={movie.rating}
        director={movie.director}
        cast={movie.cast}
      />
    </div>
  );
}
