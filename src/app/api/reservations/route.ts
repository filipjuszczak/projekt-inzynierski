import { NextResponse } from "next/server";
import { authUser } from "@/lib/auth/helpers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await authUser({ returnError: true });
    if (session instanceof NextResponse) return session;

    const reservations = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        createdAt: true,
        seats: {
          select: {
            rowNumber: true,
            seatNumber: true
          }
        },
        showtime: {
          select: {
            movie: {
              select: {
                id: true,
                title: true,
                genres: {
                  select: {
                    genre: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            },
            room: {
              select: {
                number: true
              }
            },
            startTime: true
          }
        },
        tickets: {
          select: {
            type: true,
            price: true
          }
        }
      }
    });

    const genreCount: { [key: string]: number } = {};
    let favoriteGenre = null;

    if (reservations.length > 0) {
      for (const reservation of reservations) {
        const genres = reservation.showtime.movie.genres.map(
          (genre) => genre.genre.name
        );

        for (const genre of genres) {
          if (genreCount[genre]) {
            genreCount[genre]++;
          } else {
            genreCount[genre] = 1;
          }
        }
      }

      let currentMax = 0;

      for (const [genreName, count] of Object.entries(genreCount)) {
        if (count > currentMax) {
          currentMax = count;
          favoriteGenre = genreName;
        }
      }
    }

    return NextResponse.json({ reservations, favoriteGenre });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
