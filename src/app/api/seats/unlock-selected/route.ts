import prisma from "@/lib/prisma";
import { validateBuySession } from "@/lib/auth/helpers";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const buySession = await validateBuySession();
    if (buySession instanceof Response) return buySession;

    const body = await request.json();

    const { showtimeId, seats: seatsToUnlock } = body as {
      showtimeId: string;
      seats: { rowNumber: number; seatNumber: number }[];
    };

    const seatReservations = await prisma.seatReservation.findMany({
      where: {
        showtimeId,
        rowNumber: {
          in: seatsToUnlock.map((seat) => Number(seat.rowNumber))
        },
        seatNumber: {
          in: seatsToUnlock.map((seat) => Number(seat.seatNumber))
        }
      }
    });

    if (seatReservations.length === 0) {
      return Response.json({ success: false });
    }

    if (
      seatReservations.some(
        (reservation) => reservation.sessionId !== buySession.id
      )
    ) {
      return Response.json({ success: false });
    }

    await prisma.seatReservation.deleteMany({
      where: {
        id: { in: seatReservations.map((reservation) => reservation.id) }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
