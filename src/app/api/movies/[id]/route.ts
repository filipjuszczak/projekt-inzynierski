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

    const movieId = (await params).id;
    const movie = await prisma.movie.findFirst({
      where: { id: movieId },
      include: {
        genres: {
          select: { genreId: true }
        }
      }
    });

    return Response.json(movie);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
