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

    const result = await validateSession(sessionCookie);

    if (!result || !result.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { showtimeId, rowNumber, seatNumber } = body as {
      showtimeId: string;
      rowNumber: number;
      seatNumber: number;
    };

    const [isSeatBooked, isSeatLocked] = await Promise.all([
      prisma.seat.findFirst({
        where: {
          showtimeId,
          rowNumber: Number(rowNumber),
          seatNumber: Number(seatNumber)
        },
        select: { id: true }
      }),
      prisma.seatReservation.findFirst({
        where: {
          showtimeId,
          rowNumber: Number(rowNumber),
          seatNumber: Number(seatNumber)
        },
        select: { id: true }
      })
    ]);

    if (isSeatBooked || isSeatLocked) {
      return Response.json({ success: false });
    }

    await prisma.seatReservation.create({
      data: {
        id: `${showtimeId}-${rowNumber}-${seatNumber}`,
        showtimeId,
        sessionId: result.id,
        rowNumber,
        seatNumber
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
