import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const showtimeId = searchParams.get("showtimeId");
    const rowNumber = searchParams.get("rowNumber");
    const seatNumber = searchParams.get("seatNumber");

    if (!showtimeId || !rowNumber || !seatNumber) {
      return Response.json(
        { error: "Missing search params." },
        { status: 400 }
      );
    }

    const [bookedSeat, seatReservation] = await Promise.all([
      prisma.seat.findFirst({
        where: {
          showtimeId,
          rowNumber: Number(rowNumber),
          seatNumber: Number(seatNumber)
        }
      }),
      prisma.seatReservation.findFirst({
        where: {
          showtimeId,
          rowNumber: Number(rowNumber),
          seatNumber: Number(seatNumber)
        }
      })
    ]);

    return Response.json({ isSeatLocked: !!bookedSeat || !!seatReservation });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
