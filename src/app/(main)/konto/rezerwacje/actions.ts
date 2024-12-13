"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function cancelReservation(orderId: string) {
  try {
    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) {
      return redirect("/logowanie");
    }

    const { session, user } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );
    if (!session || !session.userId) {
      return redirect("/logowanie");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true }
    });

    if (!order) {
      return { error: "Nie znaleziono rezerwacji." };
    }

    if (order.userId !== user.id) {
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
