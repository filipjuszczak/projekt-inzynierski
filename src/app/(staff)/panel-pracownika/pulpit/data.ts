import prisma from "@/lib/prisma";

export async function getMovieList() {
  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      isFeatured: true
    }
  });

  if (movies.length === 0) {
    return null;
  }

  return movies;
}
