"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { format } from "date-fns";
import { ShowtimeStatus } from "@prisma/client";
import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";
import { showtimeSchema, type ShowtimeValues } from "@/lib/validation/showtime";

export async function createShowtime(values: ShowtimeValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { movieId, roomId, startTime } = showtimeSchema.parse(values);

    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return { error: "Wybrany film nie istnieje." };
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

    const createdShowtime = await prisma.showtime.create({
      data: {
        movieId,
        roomId,
        startTime: showtimeDate,
        endTime: new Date(showtimeDate.getTime() + movie.duration * 60 * 1000),
        status: ShowtimeStatus.UPCOMING,
        createdBy: session.userId
      },
      select: { id: true }
    });

    const seatsToCreate = [];

    for (let i = 1; i <= existingRoom.numberOfRows; i++) {
      for (let j = 1; j <= existingRoom.seatsPerRow; j++) {
        seatsToCreate.push({
          rowNumber: i,
          seatNumber: j,
          isBooked: false,
          showtimeId: createdShowtime.id,
          roomId: existingRoom.id
        });
      }
    }

    await prisma.seat.createMany({
      data: seatsToCreate
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj ponownie później." };
  }
}

export async function editShowtime(id: string, values: ShowtimeValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { movieId, roomId, startTime } = showtimeSchema.parse(values);

    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return { error: "Wybrany film nie istnieje." };
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

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj ponownie później." };
  }
}

export async function deleteShowtime(id: string) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
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

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj ponownie później." };
  }
}
