"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { UTApi } from "uploadthing/server";
import { ShowtimeStatus } from "@prisma/client";
import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";
import { movieSchema, type MovieValues } from "@/lib/validation/movie";

export async function createMovie(values: MovieValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { title, description, duration, releaseDate, genres } =
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

    if (new Date(releaseDate).getFullYear() <= 1888) {
      return { error: "Rok premiery filmu musi być większy niż 1888." };
    }

    const createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        duration: Number(duration),
        releaseDate,
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

    return { success: true, movieId: createdMovie.id };
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

    const { title, description, duration, releaseDate, genres } =
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

    if (new Date(releaseDate).getFullYear() <= 1888) {
      return { error: "Rok premiery filmu musi być większy niż 1888." };
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title,
        description,
        duration: Number(duration),
        releaseDate,
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

    return { success: true, movieId: updatedMovie.id };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function deleteMovie(movieId: string) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const existingShowtime = await prisma.showtime.findFirst({
      where: {
        movieId,
        status: { in: [ShowtimeStatus.ONGOING, ShowtimeStatus.UPCOMING] }
      }
    });

    if (existingShowtime) {
      return { error: "Nie można usunąć filmu, który ma zaplanowane seanse." };
    }

    const existingMovie = await prisma.movie.findFirst({
      where: { id: movieId }
    });

    if (!existingMovie) {
      return { error: "Film nie istnieje." };
    }

    await prisma.movie.delete({
      where: { id: movieId }
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function updatePosterUrl(movieId: string, posterUrl: string) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const movie = await prisma.movie.findFirst({
      where: { id: movieId },
      select: { posterUrl: true }
    });

    if (!movie) {
      return { error: "Film nie istnieje." };
    }

    if (movie.posterUrl) {
      const key = movie.posterUrl.split("/f/").pop();
      await new UTApi().deleteFiles(key!);
    }

    await prisma.movie.update({
      where: { id: movieId },
      data: {
        posterUrl
      }
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
