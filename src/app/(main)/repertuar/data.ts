import { setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";
import { ScreenFormat, ViewingMode } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getShowtimes({
  date,
  title,
  genre,
  viewingMode,
  screenFormat
}: {
  date?: string;
  title?: string;
  genre?: string;
  viewingMode?: ViewingMode;
  screenFormat?: ScreenFormat;
}) {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const showtimes = await prisma.showtime.findMany({
    where: {
      ...(title
        ? {
            movie: {
              title: decodeURIComponent(title)
            }
          }
        : {}),
      ...(genre
        ? {
            movie: {
              genres: {
                some: {
                  genre: {
                    name: genre
                  }
                }
              }
            }
          }
        : {}),
      ...(date
        ? {
            startTime: {
              gte: setHours(new Date(date), -1),
              lte: setHours(
                setMinutes(
                  setSeconds(setMilliseconds(new Date(date), 999), 59),
                  59
                ),
                23
              )
            }
          }
        : {
            startTime: {
              gte: now,
              lte: endOfDay
            }
          }),
      ...(viewingMode ? { viewingMode: { equals: viewingMode } } : {}),
      ...(screenFormat ? { screenFormat: { equals: screenFormat } } : {})
    },
    select: {
      id: true,
      startTime: true,
      movie: {
        select: {
          title: true,
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
      }
    }
  });

  const showtimesByMovies: {
    [key: string]: {
      title: string;
      posterUrl: string | null;
      genres: { id: string; name: string; ageRestriction: number }[];
      showtimes: { id: string; startTime: Date }[];
    };
  } = {};

  showtimes.forEach((showtime) => {
    if (!showtimesByMovies[showtime.movie.title]) {
      showtimesByMovies[showtime.movie.title] = {
        title: showtime.movie.title,
        posterUrl: showtime.movie.posterUrl,
        genres: showtime.movie.genres.map((genre) => genre.genre),
        showtimes: []
      };
    }

    showtimesByMovies[showtime.movie.title].showtimes.push({
      id: showtime.id,
      startTime: showtime.startTime
    });
  });

  return showtimesByMovies;
}

export async function getShowtimeFilters() {
  const [genres, movies] = await Promise.all([
    prisma.genre.findMany({
      select: {
        id: true,
        name: true
      }
    }),
    prisma.movie.findMany({
      select: {
        id: true,
        title: true
      }
    })
  ]);

  return {
    genres,
    movies,
    viewingModes: Object.values(ViewingMode),
    screenFormats: Object.values(ScreenFormat)
  };
}
