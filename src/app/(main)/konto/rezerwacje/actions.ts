"use server";

import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { OrderType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authUser } from "@/lib/auth/helpers";

export async function cancelReservation(orderId: string) {
  try {
    const session = await authUser({ returnRedirect: true });
    if (session instanceof NextResponse) return session;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, type: true, userId: true }
    });

    if (!order) {
      return { error: "Nie znaleziono rezerwacji." };
    }

    if (order.type !== OrderType.RESERVATION) {
      return { error: "Nie można zrezygnować z zapłaconej rezerwacji." };
    }

    if (order.userId !== session.user.id) {
      return {
        error: "Nie możesz zrezygnować z rezerwacji innego użytkownika."
      };
    }

    await prisma.order.delete({
      where: { id: order.id }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Internal Server Error" };
  }

  return { success: true };
}
