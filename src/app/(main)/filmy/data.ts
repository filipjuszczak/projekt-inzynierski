import prisma from "@/lib/prisma";
import { ScreenFormat, ViewingMode } from "@prisma/client";

export async function getMovies({
  title,
  genre,
  viewingMode,
  screenFormat
}: {
  title?: string;
  genre?: string | string[];
  viewingMode?: ViewingMode | ViewingMode[];
  screenFormat?: ScreenFormat | ScreenFormat[];
}) {
  console.log("getMovies:", title, genre, viewingMode, screenFormat);

  const movies = await prisma.movie.findMany({
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
    }
  });

  // const movies = await prisma.movie.findMany({
  //   where: {
  //     ...(title && {
  //       title: {
  //         contains: title,
  //         mode: "insensitive"
  //       }
  //     }),
  //     ...(genres &&
  //       genres.length > 0 && {
  //         genres: {
  //           some: {
  //             genre: {
  //               name: {
  //                 in: genres
  //               }
  //             }
  //           }
  //         }
  //       }),
  //     ...(viewingMode &&
  //       viewingMode.length > 0 && {
  //         viewingModes: {
  //           some: {
  //             viewingMode: {
  //               in: viewingMode
  //             }
  //           }
  //         }
  //       }),
  //     ...(screenFormat &&
  //       screenFormat.length > 0 && {
  //         screenFormats: {
  //           some: {
  //             screenFormat: {
  //               in: screenFormat
  //             }
  //           }
  //         }
  //       })
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     posterUrl: true,
  //     shortDescription: true,
  //     duration: true,
  //     genres: {
  //       select: {
  //         genre: {
  //           select: {
  //             name: true
  //           }
  //         }
  //       }
  //     },
  //     releaseDate: true,
  //     viewingModes: {
  //       select: {
  //         viewingMode: true
  //       }
  //     },
  //     screenFormats: {
  //       select: {
  //         screenFormat: true
  //       }
  //     }
  //   }
  // });

  const flattenedMovies = movies.map((movie) => ({
    ...movie,
    genres: movie.genres.map(({ genre }) => genre.name),
    viewingModes: movie.viewingModes.map(({ viewingMode }) => viewingMode),
    screenFormats: movie.screenFormats.map(({ screenFormat }) => screenFormat)
  }));

  // console.log(flattenedMovies);

  return flattenedMovies;
}

export async function getFilters() {
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
