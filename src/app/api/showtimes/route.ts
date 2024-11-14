import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return Response.json(showtimes);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
