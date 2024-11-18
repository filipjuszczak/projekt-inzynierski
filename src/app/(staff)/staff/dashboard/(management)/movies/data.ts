import ky from "ky";
import prisma from "@/lib/prisma";

export async function getMovies() {
  const moviesWithGenres = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      releaseDate: true,
      duration: true,
      posterUrl: true,
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
      releaseDate: true,
      duration: true,
      posterUrl: true,
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

export async function getMovieWithExternalData(id: string) {
  const movie = await prisma.movie.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      posterUrl: true,
      duration: true,
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
    }
  });

  if (!movie) {
    return null;
  }

  const flattenedMovie = {
    ...movie,
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
