import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const showtimeId = (await params).id;
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
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

    return Response.json(showtime);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
