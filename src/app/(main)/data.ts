import prisma from "@/lib/prisma";

export async function getFeaturedMovie() {
  const featuredMovie = await prisma.movie.findFirst({
    where: { isFeatured: true },
    select: {
      id: true,
      title: true,
      posterUrl: true,
      shortDescription: true
    }
  });

  if (!featuredMovie) {
    return null;
  }

  return featuredMovie;
}

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
    take: 8
  });

  const flattenedLatestMovies = latestMovies.map((movie) => ({
    ...movie,
    genres: movie.genres.map(({ genre }) => genre.name)
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

  const flattenedUpcomingMovies = upcomingMovies.map((movie) => ({
    ...movie,
    genres: movie.genres.map(({ genre }) => genre.name)
  }));

  return flattenedUpcomingMovies;
}
