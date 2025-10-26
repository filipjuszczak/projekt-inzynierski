import prisma from "@/lib/prisma";
import { validateBuySession } from "@/lib/auth/helpers";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const buySession = await validateBuySession();
    if (buySession instanceof Response) return buySession;

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
        sessionId: buySession.id,
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
