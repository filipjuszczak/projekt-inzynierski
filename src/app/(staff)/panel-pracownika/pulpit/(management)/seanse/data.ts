import ky from "ky";
import prisma from "@/lib/prisma";

export async function getShowtimes() {
  const showtimes = await prisma.showtime.findMany({
    select: {
      id: true,
      startTime: true,
      endTime: true,
      screenFormat: true,
      viewingMode: true,
      movie: {
        select: {
          id: true,
          title: true
        }
      },
      room: {
        select: {
          id: true,
          number: true
        }
      }
    }
  });

  return showtimes;
}

export async function getShowtimeById(
  id: string,
  { fetchExternalData }: { fetchExternalData?: boolean }
) {
  const showtime = await prisma.showtime.findUnique({
    where: { id },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      screenFormat: true,
      viewingMode: true,
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          releaseDate: true,
          description: true,
          duration: true,
          screenFormats: {
            select: {
              id: true,
              screenFormat: true
            }
          },
          viewingModes: {
            select: {
              id: true,
              viewingMode: true
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
      },
      room: {
        select: {
          id: true,
          number: true,
          numberOfRows: true,
          seatsPerRow: true
        }
      },
      seats: {
        select: {
          id: true,
          rowNumber: true,
          seatNumber: true
        }
      }
    }
  });

  if (!showtime) {
    return null;
  }

  const flattenedGenres = showtime.movie.genres.map(({ genre }) => genre);

  let externalData: {
    director: string | null;
    cast: string | null;
    rating: string | null;
  } = {
    director: null,
    cast: null,
    rating: null
  };

  if (fetchExternalData) {
    const urlEncodedTitle = showtime.movie.title.replaceAll(" ", "+");

    const externalMovieData = await ky
      .get(
        `http://omdbapi.com/?apikey=${process.env.MOVIE_DB_API_KEY}&t=${urlEncodedTitle}`
      )
      .json<{
        Title: string;
        Director: string;
        Actors: string;
        Ratings: { Source: "Internet Movie Database"; Value: string }[];
      }>();

    externalData = {
      director: externalMovieData?.Director || null,
      cast: externalMovieData?.Actors || null,
      rating: externalMovieData?.Ratings?.[0]?.Value || null
    };
  }

  return {
    ...showtime,
    movie: {
      ...showtime.movie,
      genres: flattenedGenres,
      director: externalData.director,
      cast: externalData.cast,
      rating: externalData.rating
    }
  };
}
