"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";
import {
  createRoomFormSchema,
  editRoomFormSchema,
  type CreateRoomValues,
  type EditRoomValues
} from "@/lib/validation/room";

export async function createRoom(values: CreateRoomValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { number, numberOfRows, seatsPerRow } =
      createRoomFormSchema.parse(values);

    const existingRoom = await prisma.room.findFirst({
      where: { number: Number(number) }
    });

    if (existingRoom) {
      return { error: "Sala o tym numerze już istnieje" };
    }

    await prisma.room.create({
      data: {
        number: Number(number),
        numberOfRows: Number(numberOfRows),
        seatsPerRow: Number(seatsPerRow),
        createdBy: session.userId
      }
    });

    return redirect("/staff/dashboard/rooms");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editRoom(id: string, values: EditRoomValues) {
  try {
    const { number, numberOfRows, seatsPerRow } =
      editRoomFormSchema.parse(values);

    if (number) {
      const existingRoom = await prisma.room.findFirst({
        where: { number: Number(number) }
      });

      if (existingRoom) {
        return { error: "Sala o tym numerze już istnieje" };
      }
    }

    if (numberOfRows) {
      if (Number(numberOfRows) < 1) {
        return { error: "Liczba rzędów musi być większa od 0" };
      }

      if (Number(numberOfRows) > 20) {
        return { error: "Liczba rzędów nie może przekraczać 20" };
      }

      const existingShowtime = await prisma.showtime.findFirst({
        where: { roomId: id }
      });

      if (existingShowtime) {
        return { error: "Nie można edytować sali z zaplanowanymi seansami" };
      }
    }

    if (seatsPerRow) {
      if (Number(seatsPerRow) < 1) {
        return { error: "Liczba miejsc w rzędzie musi być większa od 0" };
      }

      if (Number(seatsPerRow) > 20) {
        return { error: "Liczba miejsc w rzędzie nie może przekraczać 20" };
      }

      const existingShowtime = await prisma.showtime.findFirst({
        where: { roomId: id }
      });

      if (existingShowtime) {
        return { error: "Nie można edytować sali z zaplanowanymi seansami" };
      }
    }

    if (numberOfRows) {
      await prisma.seat.deleteMany({
        where: { roomId: id }
      });

      await prisma.room.update({
        where: { id },
        data: {
          number: Number(number),
          numberOfRows: Number(numberOfRows),
          seatsPerRow: Number(seatsPerRow)
        }
      });
    }

    return redirect("/staff/dashboard/genres");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function deleteRoom(id: string) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const showtime = await prisma.showtime.findFirst({
      where: { roomId: id }
    });

    if (showtime) {
      return { error: "Nie można usunąć sali z zaplanowanym seansem" };
    }

    await prisma.room.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
