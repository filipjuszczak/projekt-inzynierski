import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";

export async function GET() {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const moviesWithGenres = await prisma.movie.findMany({
    //   include: {
    //     genres: {
    //       include: {
    //         genre: {
    //           select: {
    //             id: true,
    //             name: true,
    //             ageRestriction: true
    //           }
    //         }
    //       }
    //     }
    //   }
    // });

    const moviesWithGenres = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        releaseYear: true,
        duration: true,
        posterUrl: true,
        genres: {
          select: {
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
    });

    const flattenedMoviesWithGenres = moviesWithGenres.map((movie) => ({
      ...movie,
      genres: movie.genres.map((genre) => ({
        id: genre.genre.id,
        name: genre.genre.name,
        ageRestriction: genre.genre.ageRestriction
      }))
    }));

    return Response.json(flattenedMoviesWithGenres);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
