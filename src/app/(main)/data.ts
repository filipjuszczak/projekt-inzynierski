import prisma from "@/lib/prisma";

export async function getLatestMovies() {
  const latestMovies = await prisma.movie.findMany({
    where: {
      releaseDate: {
        lte: new Date()
      }
    },
    orderBy: {
      releaseDate: "desc"
    },
    select: {
      id: true,
      title: true,
      posterUrl: true,
      releaseDate: true,
      shortDescription: true,
      genres: {
        select: {
          genre: {
            select: {
              name: true
            }
          }
        }
      }
    },
    take: 4
  });

  const flattenedLatestMovies = latestMovies.map((movie) => ({
    ...movie,
    genres: movie.genres.map((genre) => genre.genre.name)
  }));

  return flattenedLatestMovies;
}

export async function getUpcomingMovies() {
  const upcomingMovies = await prisma.movie.findMany({
    where: {
      releaseDate: {
        gt: new Date()
      }
    },
    orderBy: {
      releaseDate: "desc"
    },
    select: {
      id: true,
      title: true,
      posterUrl: true,
      releaseDate: true
    },
    take: 4
  });

  return upcomingMovies;
}
