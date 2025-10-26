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
import { authEmployee } from "@/lib/auth/helpers";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { showtimeSchema, type ShowtimeValues } from "@/lib/validation/showtime";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function createShowtime(values: ShowtimeValues) {
  try {
    const session = await authEmployee({ returnRedirect: true });
    if (session instanceof NextResponse) return session;

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
    const showtimeEndTime = new Date(
      showtimeDate.getTime() + movie.duration * 60 * 1000
    );
    const showtimeEndTimeWithBreak = new Date(
      showtimeEndTime.getTime() + fifteenMinutes
    );

    const overlappingShowtime = await prisma.showtime.findFirst({
      where: {
        roomId,
        OR: [
          {
            AND: [
              { startTime: { lte: showtimeDate } },
              {
                endTime: {
                  gte: new Date(showtimeDate.getTime() - fifteenMinutes)
                }
              }
            ]
          },
          {
            AND: [
              { startTime: { lte: showtimeEndTimeWithBreak } },
              { endTime: { gte: showtimeEndTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: showtimeDate } },
              { endTime: { lte: showtimeEndTimeWithBreak } }
            ]
          }
        ]
      }
    });

    if (overlappingShowtime) {
      return {
        error: `Wybrany termin koliduje z innym seansem w tej sali: ${format(new Date(overlappingShowtime.startTime), "dd.MM.yyyy HH:mm")} - ${format(new Date(overlappingShowtime.endTime), "dd.MM.yyyy HH:mm")}`
      };
    }

    await prisma.showtime.create({
      data: {
        movieId,
        roomId,
        startTime: showtimeDate,
        endTime: showtimeEndTime,
        status: ShowtimeStatus.UPCOMING,
        viewingMode,
        screenFormat,
        createdBy: session.user.id
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
    const session = await authEmployee({ returnRedirect: true });
    if (session instanceof NextResponse) return session;

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
    const showtimeEndTime = new Date(
      showtimeDate.getTime() + movie.duration * 60 * 1000
    );
    const showtimeEndTimeWithBreak = new Date(
      showtimeEndTime.getTime() + fifteenMinutes
    );

    const overlappingShowtime = await prisma.showtime.findFirst({
      where: {
        roomId,
        id: { not: id },
        OR: [
          {
            AND: [
              { startTime: { lte: showtimeDate } },
              {
                endTime: {
                  gte: new Date(showtimeDate.getTime() - fifteenMinutes)
                }
              }
            ]
          },
          {
            AND: [
              { startTime: { lte: showtimeEndTimeWithBreak } },
              { endTime: { gte: showtimeEndTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: showtimeDate } },
              { endTime: { lte: showtimeEndTimeWithBreak } }
            ]
          }
        ]
      }
    });

    if (overlappingShowtime) {
      return {
        error: `Wybrany termin koliduje z innym seansem w tej sali: ${format(new Date(overlappingShowtime.startTime), "dd.MM.yyyy HH:mm")} - ${format(new Date(overlappingShowtime.endTime), "dd.MM.yyyy HH:mm")}`
      };
    }

    await prisma.showtime.update({
      where: { id },
      data: {
        movieId,
        roomId,
        startTime: showtimeDate,
        endTime: showtimeEndTime,
        status: ShowtimeStatus.UPCOMING,
        viewingMode,
        screenFormat,
        updatedBy: session.user.id
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
    await authEmployee({ returnRedirect: true });

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
    await authEmployee({ returnRedirect: true });

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
    await authEmployee({ returnRedirect: true });

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
