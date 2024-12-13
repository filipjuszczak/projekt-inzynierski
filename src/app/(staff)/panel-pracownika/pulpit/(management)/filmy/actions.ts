"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { UTApi } from "uploadthing/server";
import {
  Role,
  ScreenFormat,
  ShowtimeStatus,
  ViewingMode
} from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { movieSchema, type MovieValues } from "@/lib/validation/movie";

export async function createMovie(values: MovieValues) {
  let createdMovie: { id: string };

  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const {
      title,
      description,
      shortDescription,
      duration,
      viewingModes,
      screenFormats,
      releaseDate,
      genres
    } = movieSchema.parse(values);

    const existingMovie = await prisma.movie.findFirst({
      where: { title }
    });

    if (existingMovie) {
      return { error: "Film o takim tytule już istnieje." };
    }

    if (new Date(releaseDate).getFullYear() <= 1888) {
      return { error: "Rok premiery filmu musi być większy niż 1888." };
    }

    const availableViewingModes = Object.values(ViewingMode);

    for (const vm of viewingModes) {
      if (!availableViewingModes.includes(vm)) {
        return { error: "Nieprawidłowy rodzaj audio." };
      }
    }

    const availableScreenFormats = Object.values(ScreenFormat);

    for (const sf of screenFormats) {
      if (!availableScreenFormats.includes(sf)) {
        return { error: "Nieprawidłowy format ekranu." };
      }
    }

    createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        shortDescription,
        duration: Number(duration),
        releaseDate,
        createdBy: session.userId,
        updatedBy: null,
        viewingModes: {
          create: [...viewingModes.map((vm) => ({ viewingMode: vm }))]
        },
        screenFormats: {
          create: [...screenFormats.map((sf) => ({ screenFormat: sf }))]
        }
      },
      select: {
        id: true
      }
    });

    await prisma.genresOnMovies.createMany({
      data: genres.map((genreId) => ({
        movieId: createdMovie.id,
        genreId
      }))
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/filmy");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true, movieId: createdMovie.id };
}

export async function editMovie(movieId: string, values: MovieValues) {
  let updatedMovie;

  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const {
      title,
      description,
      shortDescription,
      duration,
      viewingModes,
      screenFormats,
      releaseDate,
      genres
    } = movieSchema.parse(values);

    const existingMovie = await prisma.movie.findFirst({
      where: { title }
    });

    if (existingMovie && existingMovie.id !== movieId) {
      return { error: "Film o takim tytule już istnieje." };
    }

    if (new Date(releaseDate).getFullYear() <= 1888) {
      return { error: "Rok premiery filmu musi być większy niż 1888." };
    }

    const availableViewingModes = Object.values(ViewingMode);

    for (const vm of viewingModes) {
      if (!availableViewingModes.includes(vm)) {
        return { error: "Nieprawidłowy rodzaj audio." };
      }
    }

    const availableScreenFormats = Object.values(ScreenFormat);

    for (const sf of screenFormats) {
      if (!availableScreenFormats.includes(sf)) {
        return { error: "Nieprawidłowy format ekranu." };
      }
    }

    const [movie] = await prisma.$transaction([
      prisma.movie.update({
        where: { id: movieId },
        data: {
          title,
          description,
          shortDescription,
          duration: Number(duration),
          releaseDate,
          updatedBy: session.userId
        },
        select: {
          id: true
        }
      }),
      prisma.genresOnMovies.deleteMany({
        where: { movieId }
      }),
      prisma.movieViewingMode.deleteMany({
        where: { movieId }
      }),
      prisma.movieScreenFormat.deleteMany({
        where: { movieId }
      }),
      prisma.genresOnMovies.createMany({
        data: genres.map((genreId) => ({
          movieId,
          genreId
        }))
      }),
      prisma.movieViewingMode.createMany({
        data: viewingModes.map((vm) => ({
          movieId,
          viewingMode: vm
        }))
      }),
      prisma.movieScreenFormat.createMany({
        data: screenFormats.map((sf) => ({
          movieId,
          screenFormat: sf
        }))
      })
    ]);

    updatedMovie = movie;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/filmy");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true, movieId: updatedMovie.id };
}

export async function deleteMovie(movieId: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
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
      where: { id: movieId },
      select: {
        posterUrl: true
      }
    });

    if (!existingMovie) {
      return { error: "Film nie istnieje." };
    }

    await prisma.movie.delete({
      where: { id: movieId }
    });

    const firstMovie = await prisma.movie.findFirst({
      select: { id: true }
    });

    if (firstMovie) {
      await prisma.movie.update({
        where: { id: firstMovie.id },
        data: { isFeatured: true }
      });
    }

    if (existingMovie.posterUrl) {
      const key = existingMovie.posterUrl.split("/f/").pop();
      await new UTApi().deleteFiles(key!);
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/filmy");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true };
}

export async function updatePosterUrl(movieId: string, posterUrl: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
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
