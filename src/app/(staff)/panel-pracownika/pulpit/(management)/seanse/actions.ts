"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { format } from "date-fns";
import {
  Role,
  ScreenFormat,
  ShowtimeStatus,
  ViewingMode
} from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { showtimeSchema, type ShowtimeValues } from "@/lib/validation/showtime";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";

export async function createShowtime(values: ShowtimeValues) {
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

    const { movieId, roomId, startTime, viewingMode, screenFormat } =
      showtimeSchema.parse(values);

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: {
        duration: true,
        viewingModes: {
          select: {
            viewingMode: true
          }
        },
        screenFormats: {
          select: {
            screenFormat: true
          }
        }
      }
    });

    if (!movie) {
      return { error: "Wybrany film nie istnieje." };
    }

    const availableViewingModes = Object.values(ViewingMode);

    if (!availableViewingModes.includes(viewingMode)) {
      return { error: "Nieprawidłowy rodzaj audio." };
    }

    const availableScreenFormats = Object.values(ScreenFormat);

    if (!availableScreenFormats.includes(screenFormat)) {
      return { error: "Nieprawidłowy format ekranu." };
    }

    if (
      !movie.viewingModes.map((mode) => mode.viewingMode).includes(viewingMode)
    ) {
      return { error: "Film nie obsługuje wybranego rodzaju audio." };
    }

    if (
      !movie.screenFormats
        .map((format) => format.screenFormat)
        .includes(screenFormat)
    ) {
      return { error: "Film nie obsługuje wybranego formatu ekranu." };
    }

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, numberOfRows: true, seatsPerRow: true }
    });

    if (!existingRoom) {
      return { error: "Wybrana sala nie istnieje." };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    const showtimeDate = new Date(startTime.getTime());

    const prevShowtimeInRoom = await prisma.showtime.findFirst({
      where: {
        roomId,
        startTime: { lte: showtimeDate }
      },
      orderBy: { startTime: "desc" }
    });

    if (prevShowtimeInRoom) {
      const diff =
        showtimeDate.getTime() - prevShowtimeInRoom.endTime.getTime();

      if (diff < fifteenMinutes) {
        return {
          error: `Poprzedni seans w tej sali kończy się ${format(new Date(prevShowtimeInRoom.endTime), "dd/MM/yyyy HH:mm")}. Następny seans w tej sali musi rozpoczynać się co najmniej 15 minut po zakończeniu poprzedniego.`
        };
      }
    }

    const nextShowtimeInRoom = await prisma.showtime.findFirst({
      where: {
        roomId,
        startTime: { gte: showtimeDate },
        status: {
          in: [ShowtimeStatus.ONGOING, ShowtimeStatus.FINISHED]
        }
      },
      orderBy: { startTime: "asc" }
    });

    if (nextShowtimeInRoom) {
      const showtimeEndTime = new Date(
        showtimeDate.getTime() + movie.duration * 60 * 1000
      );

      const diff =
        showtimeEndTime.getTime() +
        fifteenMinutes -
        nextShowtimeInRoom.startTime.getTime();

      if (diff < 0) {
        return {
          error: "Wybrany seans koliduje z kolejnym seansem w tej sali."
        };
      }
    }

    await prisma.showtime.create({
      data: {
        movieId,
        roomId,
        startTime: showtimeDate,
        endTime: new Date(showtimeDate.getTime() + movie.duration * 60 * 1000),
        status: ShowtimeStatus.UPCOMING,
        viewingMode,
        screenFormat,
        createdBy: session.userId
      },
      select: { id: true }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/seanse");

  return { success: true };
}

export async function editShowtime(id: string, values: ShowtimeValues) {
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

    const { movieId, roomId, startTime, viewingMode, screenFormat } =
      showtimeSchema.parse(values);

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: {
        duration: true,
        viewingModes: {
          select: {
            viewingMode: true
          }
        },
        screenFormats: {
          select: {
            screenFormat: true
          }
        }
      }
    });

    if (!movie) {
      return { error: "Wybrany film nie istnieje." };
    }

    const availableViewingModes = Object.values(ViewingMode);

    if (!availableViewingModes.includes(viewingMode)) {
      return { error: "Nieprawidłowy rodzaj audio." };
    }

    const availableScreenFormats = Object.values(ScreenFormat);

    if (!availableScreenFormats.includes(screenFormat)) {
      return { error: "Nieprawidłowy format ekranu." };
    }

    if (
      !movie.viewingModes.map((mode) => mode.viewingMode).includes(viewingMode)
    ) {
      return { error: "Film nie obsługuje wybranego rodzaju audio." };
    }

    if (
      !movie.screenFormats
        .map((format) => format.screenFormat)
        .includes(screenFormat)
    ) {
      return { error: "Film nie obsługuje wybranego formatu ekranu." };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    const showtimeDate = new Date(startTime.getTime());

    const prevShowtimeInRoom = await prisma.showtime.findFirst({
      where: {
        roomId,
        startTime: { lte: showtimeDate },
        status: {
          in: [ShowtimeStatus.ONGOING, ShowtimeStatus.FINISHED]
        },
        id: { not: id }
      },
      orderBy: { startTime: "desc" }
    });

    if (prevShowtimeInRoom) {
      const diff =
        showtimeDate.getTime() - prevShowtimeInRoom.endTime.getTime();
      if (diff < fifteenMinutes) {
        return {
          error: "Kolejne seanse muszą być oddzielone o co najmniej 15 minut."
        };
      }
    }

    const nextShowtimeInRoom = await prisma.showtime.findFirst({
      where: {
        roomId,
        startTime: { gte: showtimeDate },
        status: {
          in: [ShowtimeStatus.ONGOING, ShowtimeStatus.FINISHED]
        }
      },
      orderBy: { startTime: "asc" }
    });

    if (nextShowtimeInRoom) {
      const showtimeEndTime = new Date(
        showtimeDate.getTime() + movie.duration * 60 * 1000
      );

      const diff =
        showtimeEndTime.getTime() +
        fifteenMinutes -
        nextShowtimeInRoom.startTime.getTime();

      if (diff < 0) {
        return {
          error: "Wybrany seans koliduje z kolejnym seansem w tej sali."
        };
      }
    }

    await prisma.showtime.update({
      where: { id },
      data: {
        movieId,
        roomId,
        startTime: showtimeDate,
        endTime: new Date(showtimeDate.getTime() + movie.duration * 60 * 1000),
        status: ShowtimeStatus.UPCOMING,
        updatedBy: session.userId
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/seanse");

  return { success: true };
}

export async function deleteShowtime(id: string) {
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

    const existingShowtime = await prisma.showtime.findUnique({
      where: { id }
    });

    if (!existingShowtime) {
      return { error: "Seans nie istnieje." };
    }

    const existingOrder = await prisma.order.findFirst({
      where: { showtimeId: id }
    });

    if (existingOrder) {
      return { error: "Nie można usunąć seansu, który posiada rezerwacje." };
    }

    await prisma.showtime.delete({
      where: { id }
    });

    await prisma.seat.deleteMany({
      where: { showtimeId: id }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/seanse");

  return { success: true };
}

export async function markShowtimeAsOngoing(id: string) {
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

    const existingShowtime = await prisma.showtime.findUnique({
      where: { id }
    });

    if (!existingShowtime) {
      return { error: "Seans nie istnieje." };
    }

    await prisma.showtime.update({
      where: { id },
      data: { status: ShowtimeStatus.ONGOING }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/seanse");

  return { success: true };
}

export async function markShowtimeAsFinished(id: string) {
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

    const existingShowtime = await prisma.showtime.findUnique({
      where: { id }
    });

    if (!existingShowtime) {
      return { error: "Seans nie istnieje." };
    }

    await prisma.showtime.update({
      where: { id },
      data: { status: ShowtimeStatus.FINISHED }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/seanse");

  return { success: true };
}
