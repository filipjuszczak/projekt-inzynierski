"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import {
  createMovieFormSchema,
  type CreateMovieValues
} from "@/lib/validation/movie";

export async function createMovie(values: CreateMovieValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { title, description, duration, releaseYear, genres } =
      createMovieFormSchema.parse(values);

    const existingMovie = await prisma.movie.findFirst({
      where: { title }
    });

    if (existingMovie) {
      return { error: "Film o takim tytule już istnieje." };
    }

    if (Number(duration) < 1) {
      return { error: "Czas trwania filmu musi być większy niż 0." };
    }

    const createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        duration: Number(duration),
        releaseYear: Number(releaseYear),
        createdBy: session.userId
      }
    });

    await prisma.genresOnMovies.createMany({
      data: genres.map((genreId) => ({
        movieId: createdMovie.id,
        genreId
      }))
    });

    return redirect("/staff/dashboard/movies");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editMovie(movieId: string, values: EditMovieValues) {
  try {
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
