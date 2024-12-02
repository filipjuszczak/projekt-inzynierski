import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title") || undefined;
  const genre = request.nextUrl.searchParams.getAll("genre") || undefined;
  const viewingMode =
    (request.nextUrl.searchParams.getAll("viewingMode") as ViewingMode[]) ||
    undefined;
  const screenFormat =
    (request.nextUrl.searchParams.getAll("screenFormat") as ScreenFormat[]) ||
    undefined;
  const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

  const pageSize = 4;

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
    },
    orderBy: { releaseDate: "desc" },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined
  });

  const nextCursor = movies.length > pageSize ? movies[pageSize].id : null;

  const flattenedMovies = movies.slice(0, pageSize).map((movie) => ({
    ...movie,
    genres: movie.genres.map(({ genre }) => genre.name),
    viewingModes: movie.viewingModes.map(({ viewingMode }) => viewingMode),
    screenFormats: movie.screenFormats.map(({ screenFormat }) => screenFormat)
  }));

  const data = {
    movies: flattenedMovies,
    nextCursor
  };

  return Response.json(data);
}
