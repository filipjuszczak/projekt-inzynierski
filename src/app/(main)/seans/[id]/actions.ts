"use server";

import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { OrderType } from "@prisma/client";
import { validateSession } from "@/app/actions";
import prisma from "@/lib/prisma";
import type { SelectedSeat } from "@/components/showtimes/OrderTickets";

export async function createCheckoutSession({
  showtimeId,
  selectedSeats
}: {
  showtimeId: string;
  selectedSeats: SelectedSeat[];
}) {
  try {
    const cookieStore = await cookies();
    const sessionCookie =
      cookieStore.get("auth_session") || cookieStore.get("guest_session");

    if (!sessionCookie) {
      return { error: "Unauthorized" };
    }

    const session = await validateSession(sessionCookie);
    if (!session) {
      return { error: "Sesja wygasła." };
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId }
    });

    if (!showtime) {
      return { error: "Seans o podanym ID nie istnieje." };
    }

    const createdOrder = await prisma.order.create({
      data: {
        type: OrderType.PAID,
        isPaid: false,
        userId: session.userId,
        showtimeId: showtime.id
      },
      select: {
        id: true
      }
    });

    const createdSeats = await prisma.seat.createMany({
      data: selectedSeats.map((seat) => ({
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
        showtimeId: showtime.id,
        roomId: showtime.roomId,
        userId: session.userId,
        orderId: createdOrder.id
      }))
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Internal Server Error" };
  }
}
