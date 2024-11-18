import prisma from "@/lib/prisma";

export async function getGenres() {
  const genresWithMovieCount = await prisma.genre.findMany({
    select: {
      id: true,
      name: true,
      ageRestriction: true,
      _count: {
        select: {
          movies: true
        }
      }
    }
  });

  return genresWithMovieCount;
}

export async function getGenreById(id: string) {
  const genre = await prisma.genre.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      ageRestriction: true
    }
  });

  return genre;
}
