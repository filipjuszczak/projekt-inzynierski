import prisma from "@/lib/prisma";
import { validateSession } from "@/app/actions";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie =
      request.cookies.get("auth_session") ||
      request.cookies.get("guest_session");

    if (!sessionCookie) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await validateSession(sessionCookie);

    if (!session || !session.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { showtimeId, seats: seatsToUnlock } = body as {
      showtimeId: string;
      seats: { rowNumber: number; seatNumber: number }[];
    };

    const seatReservations = await prisma.seatReservation.findMany({
      where: {
        showtimeId,
        AND: seatsToUnlock.map((seat) => ({
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber
        }))
      }
    });

    if (seatReservations.length === 0) {
      return Response.json({ success: false }, { status: 404 });
    }

    if (
      seatReservations.some(
        (reservation) => reservation.sessionId !== session.id
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
