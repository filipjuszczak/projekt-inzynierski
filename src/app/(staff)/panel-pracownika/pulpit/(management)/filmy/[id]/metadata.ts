import prisma from "@/lib/prisma";

export async function getMovieMetadata(id: string) {
  const movie = await prisma.movie.findUnique({
    where: { id },
    select: { title: true }
  });

  return {
    title: movie?.title
  };
}
