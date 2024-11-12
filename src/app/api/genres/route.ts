import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";

export async function GET() {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genresWithMovieCount = await prisma.genre.findMany({
      select: {
        id: true,
        name: true,
        ageRestriction: true,
        _count: {
          select: {
            movies: true
          }
        }
      }
    });

    return Response.json(genresWithMovieCount);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
