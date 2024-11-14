import prisma from "@/lib/prisma";
import Image from "next/image";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({
  params
}: MovieDetailsPageProps) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({
    where: { id }
  });

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      {movie.posterUrl && (
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          width={200}
          height={300}
        />
      )}
    </main>
  );
}
