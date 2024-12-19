import ky from "ky";
import prisma from "@/lib/prisma";

export async function getMovies() {
  const moviesWithGenres = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      duration: true,
      releaseDate: true,
      viewingModes: {
        select: {
          id: true,
          viewingMode: true
        }
      },
      screenFormats: {
        select: {
          id: true,
          screenFormat: true
        }
      },
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
              ageRestriction: true
            }
          }
        }
      }
    }
  });

  const flattenedMoviesWithGenres = moviesWithGenres.map((movie) => ({
    ...movie,
    genres: movie.genres.map((genre) => ({
      id: genre.genre.id,
      name: genre.genre.name,
      ageRestriction: genre.genre.ageRestriction
    }))
  }));

  return flattenedMoviesWithGenres;
}

export async function getMovieById(id: string) {
  const movie = await prisma.movie.findFirst({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      shortDescription: true,
      releaseDate: true,
      duration: true,
      posterUrl: true,
      viewingModes: {
        select: {
          id: true,
          viewingMode: true
        }
      },
      screenFormats: {
        select: {
          id: true,
          screenFormat: true
        }
      },
      genres: {
        select: { genreId: true }
      }
    }
  });

  if (!movie) {
    return null;
  }

  const flattenedMovie = {
    ...movie,
    genres: movie.genres.map((genre) => genre.genreId)
  };

  return flattenedMovie;
}

export async function getMovieWithExternalData({
  id,
  title
}: {
  id?: string;
  title?: string;
}) {
  let movie;

  const select = {
    id: true,
    title: true,
    description: true,
    posterUrl: true,
    duration: true,
    viewingModes: {
      select: {
        id: true,
        viewingMode: true
      }
    },
    screenFormats: {
      select: {
        id: true,
        screenFormat: true
      }
    },
    releaseDate: true,
    genres: {
      select: {
        genre: {
          select: {
            id: true,
            name: true,
            ageRestriction: true
          }
        }
      }
    }
  };

  if (title) {
    movie = await prisma.movie.findFirst({
      where: { title },
      select
    });
  } else {
    movie = await prisma.movie.findUnique({
      where: { id },
      select
    });
  }

  if (!movie) {
    return null;
  }

  const upcomingShowtimes = await prisma.showtime.findMany({
    where: { movieId: id, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      viewingMode: true,
      screenFormat: true,
      status: true,
      room: {
        select: {
          id: true,
          number: true
        }
      },
      movie: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  const flattenedMovie = {
    ...movie,
    upcomingShowtimes,
    genres: movie.genres.map((genre) => ({
      id: genre.genre.id,
      name: genre.genre.name,
      ageRestriction: genre.genre.ageRestriction
    }))
  };

  const urlEncodedTitle = movie.title.replaceAll(" ", "+");
  const movieData = await ky
    .get(
      `http://omdbapi.com/?apikey=${process.env.MOVIE_DB_API_KEY}&t=${urlEncodedTitle}`
    )
    .json<{
      Title: string;
      Director: string;
      Actors: string;
      Ratings: { Source: "Internet Movie Database"; Value: string }[];
    }>();

  return {
    ...flattenedMovie,
    rating: movieData.Ratings?.[0].Value || null,
    director: movieData.Director || null,
    cast: movieData.Actors || null
  };
}

export async function getMoviesPromise() {
  return prisma.movie.findMany({
    select: { id: true, title: true }
  });
}
