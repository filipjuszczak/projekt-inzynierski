"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Role } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import prisma from "@/lib/prisma";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";

export async function setReservationAsPaid(orderId: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.ADMIN,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return { error: "Nie znaleziono rezerwacji." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  return { success: true };
}

export async function deleteReservation(orderId: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.ADMIN,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true }
    });

    if (!existingOrder) {
      return { error: "Nie znaleziono rezerwacji." };
    }

    await prisma.$transaction([
      prisma.order.delete({
        where: { id: orderId }
      }),
      prisma.ticket.deleteMany({
        where: { orderId }
      }),
      prisma.seat.deleteMany({
        where: { orderId }
      })
    ]);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  return { success: true };
}
