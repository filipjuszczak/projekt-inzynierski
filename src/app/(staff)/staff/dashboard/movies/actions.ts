"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";
import { movieSchema, type MovieValues } from "@/lib/validation/movie";

export async function createMovie(values: MovieValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { title, posterUrl, description, duration, releaseYear, genres } =
      movieSchema.parse(values);

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
        posterUrl,
        description,
        duration: Number(duration),
        releaseYear: Number(releaseYear),
        createdBy: session.userId,
        updatedBy: null
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

export async function editMovie(movieId: string, values: MovieValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { title, posterUrl, description, duration, releaseYear, genres } =
      movieSchema.parse(values);

    const existingMovie = await prisma.movie.findFirst({
      where: { title }
    });

    if (existingMovie && existingMovie.id !== movieId) {
      return { error: "Film o takim tytule już istnieje." };
    }

    if (Number(duration) < 1) {
      return { error: "Czas trwania filmu musi być większy niż 0." };
    }

    if (Number(releaseYear) <= 1888) {
      return { error: "Rok premiery filmu musi być większy niż 1888." };
    }

    await prisma.movie.update({
      where: { id: movieId },
      data: {
        title,
        posterUrl,
        description,
        duration: Number(duration),
        releaseYear: Number(releaseYear),
        updatedBy: session.userId
      }
    });

    await prisma.genresOnMovies.deleteMany({
      where: { movieId }
    });

    await prisma.genresOnMovies.createMany({
      data: genres.map((genreId) => ({
        movieId,
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
