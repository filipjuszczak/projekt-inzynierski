import prisma from "@/lib/prisma";

export async function getMovieMetadata(title: string) {
  const movie = await prisma.movie.findUnique({
    where: { title },
    select: { description: true, posterUrl: true }
  });

  return { description: movie?.description, posterUrl: movie?.posterUrl };
}
