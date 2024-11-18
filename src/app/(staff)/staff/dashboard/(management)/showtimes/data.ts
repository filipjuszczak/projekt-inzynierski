import ky from "ky";
import prisma from "@/lib/prisma";

export async function getShowtimes() {
  const showtimes = await prisma.showtime.findMany({
    select: {
      id: true,
      startTime: true,
      endTime: true,
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          description: true,
          releaseDate: true,
          duration: true,
          genres: {
            include: {
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
          number: true
        }
      }
    }
  });

  if (!showtimes.length) {
    return null;
  }

  return showtimes;
}

export async function getShowtimeById(id: string) {
  const showtime = await prisma.showtime.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          releaseDate: true,
          description: true,
          duration: true,
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
        where: {
          isBooked: true
        },
        select: {
          id: true,
          rowNumber: true,
          seatNumber: true,
          isBooked: true
        }
      }
    }
  });

  if (!showtime) {
    return null;
  }

  const flattenedGenres = showtime.movie.genres.map(({ genre }) => genre);

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

  return {
    ...showtime,
    movie: {
      ...showtime.movie,
      genres: flattenedGenres,
      director: externalMovieData.Director || null,
      cast: externalMovieData.Actors || null,
      rating: externalMovieData.Ratings[0].Value || null
    }
  };
}
