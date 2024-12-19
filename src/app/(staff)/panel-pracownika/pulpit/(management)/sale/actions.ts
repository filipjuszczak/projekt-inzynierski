"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { roomSchema, type RoomValues } from "@/lib/validation/room";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";

export async function createRoom(values: RoomValues) {
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

    const { number, numberOfRows, seatsPerRow } = roomSchema.parse(values);

    const existingRoom = await prisma.room.findFirst({
      where: { number }
    });

    if (existingRoom) {
      return { error: "Sala o tym numerze już istnieje" };
    }

    await prisma.room.create({
      data: {
        number,
        numberOfRows: Number(numberOfRows),
        seatsPerRow: Number(seatsPerRow),
        createdBy: session.userId
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/sale");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true };
}

export async function editRoom(id: string, values: RoomValues) {
  try {
    const { number, numberOfRows, seatsPerRow } = roomSchema.parse(values);

    if (number) {
      const existingRoom = await prisma.room.findFirst({
        where: { number }
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
          number,
          numberOfRows: Number(numberOfRows),
          seatsPerRow: Number(seatsPerRow)
        }
      });
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/sale");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true };
}

export async function deleteRoom(id: string) {
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

    const showtime = await prisma.showtime.findFirst({
      where: { roomId: id }
    });

    if (showtime) {
      return { error: "Nie można usunąć sali z zaplanowanym seansem." };
    }

    await prisma.room.delete({ where: { id } });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/sale");
  revalidatePath("/panel-pracownika/pulpit/seanse/nowy");

  return { success: true };
}
