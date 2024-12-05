import { ScreenFormat, ViewingMode } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { Filters } from "@/lib/types";

const PAGE_SIZE = 8;

export async function getMovies({
  page = "1",
  title,
  genre,
  viewingMode,
  screenFormat
}: Filters) {
  const [movies, totalCount] = await Promise.all([
    prisma.movie.findMany({
      where: {
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive"
          }
        }),
        ...(genre &&
          genre.length > 0 && {
            genres: {
              some: {
                genre: {
                  name: Array.isArray(genre) ? { in: genre } : { equals: genre }
                }
              }
            }
          }),
        ...(viewingMode &&
          viewingMode.length > 0 && {
            viewingModes: {
              some: {
                viewingMode: Array.isArray(viewingMode)
                  ? { in: viewingMode }
                  : { equals: viewingMode }
              }
            }
          }),
        ...(screenFormat &&
          screenFormat.length > 0 && {
            screenFormats: {
              some: {
                screenFormat: Array.isArray(screenFormat)
                  ? { in: screenFormat }
                  : { equals: screenFormat }
              }
            }
          })
      },
      select: {
        _count: true,
        id: true,
        title: true,
        posterUrl: true,
        shortDescription: true,
        duration: true,
        genres: {
          select: {
            genre: {
              select: {
                name: true
              }
            }
          }
        },
        releaseDate: true,
        viewingModes: {
          select: {
            viewingMode: true
          }
        },
        screenFormats: {
          select: {
            screenFormat: true
          }
        }
      },
      orderBy: { releaseDate: "desc" },
      take: PAGE_SIZE,
      skip: PAGE_SIZE * (Number(page) - 1)
    }),
    prisma.movie.count({
      where: {
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive"
          }
        }),
        ...(genre &&
          genre.length > 0 && {
            genres: {
              some: {
                genre: {
                  name: Array.isArray(genre) ? { in: genre } : { equals: genre }
                }
              }
            }
          }),
        ...(viewingMode &&
          viewingMode.length > 0 && {
            viewingModes: {
              some: {
                viewingMode: Array.isArray(viewingMode)
                  ? { in: viewingMode }
                  : { equals: viewingMode }
              }
            }
          }),
        ...(screenFormat &&
          screenFormat.length > 0 && {
            screenFormats: {
              some: {
                screenFormat: Array.isArray(screenFormat)
                  ? { in: screenFormat }
                  : { equals: screenFormat }
              }
            }
          })
      }
    })
  ]);

  const flattenedMovies = movies.map((movie) => ({
    ...movie,
    genres: movie.genres.map(({ genre }) => genre.name),
    viewingModes: movie.viewingModes.map(({ viewingMode }) => viewingMode),
    screenFormats: movie.screenFormats.map(({ screenFormat }) => screenFormat)
  }));

  return {
    movies: flattenedMovies,
    totalCount
  };
}

export async function getMovieFilters() {
  const genres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true
    }
  });

  return {
    genres,
    viewingModes: Object.values(ViewingMode),
    screenFormats: Object.values(ScreenFormat)
  };
}

interface DataItem {
  id: string;
  startTime: Date;
}

type GroupedByDate = Record<string, DataItem[]>;

export async function getShowtimesByMovieTitle(title: string) {
  const upcomingShowtimes = await prisma.showtime.findMany({
    where: {
      movie: {
        title
      },
      startTime: {
        gte: new Date()
      }
    },
    orderBy: {
      startTime: "asc"
    },
    select: {
      id: true,
      startTime: true
    }
  });

  const sortedShowtimes = upcomingShowtimes.reduce(
    (acc: GroupedByDate, item: DataItem) => {
      const dateKey = item.startTime
        .toLocaleDateString("pl-PL")
        .replaceAll(".", "-")
        .split("-")
        .reverse()
        .join("-");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(item);

      return acc;
    },
    {}
  );

  return sortedShowtimes;
}
