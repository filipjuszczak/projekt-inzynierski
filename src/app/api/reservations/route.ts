import { NextResponse, type NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import { USER_ACTIVITIES } from "@/lib/constants";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { session, user } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );

    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reservations = await prisma.order.findMany({
      where: { userId: user.id },
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
