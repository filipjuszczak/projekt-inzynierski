import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const page = params.get("page") ?? "1";
  const title = params.get("title") ?? undefined;
  const genre = params.getAll("genre") ?? undefined;
  const viewingMode = params.getAll("viewingMode") as ViewingMode[];
  const screenFormat = params.getAll("screenFormat") as ScreenFormat[];

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

  return NextResponse.json({ movies: flattenedMovies, totalCount });
}
