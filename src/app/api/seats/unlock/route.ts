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

    // const [bookedSeat, seatReservation] = await Promise.all([
    //   prisma.seat.findFirst({
    //     where: {
    //       showtimeId,
    //       rowNumber: Number(rowNumber),
    //       seatNumber: Number(seatNumber)
    //     },
    //     select: { id: true }
    //   }),
    //   prisma.seatReservation.findFirst({
    //     where: {
    //       showtimeId,
    //       rowNumber: Number(rowNumber),
    //       seatNumber: Number(seatNumber)
    //     },
    //     select: { id: true, sessionId: true }
    //   })
    // ]);

    const bookedSeat = await prisma.seat.findFirst({
      where: {
        showtimeId,
        rowNumber: Number(rowNumber),
        seatNumber: Number(seatNumber)
      },
      select: { id: true }
    });

    if (bookedSeat) {
      return Response.json(
        {
          error:
            "Nie można anulować rezerwacji miejsca, które zostało już zakupione."
        },
        { status: 400 }
      );
    }

    const seatReservation = await prisma.seatReservation.findFirst({
      where: {
        showtimeId,
        rowNumber: Number(rowNumber),
        seatNumber: Number(seatNumber)
      },
      select: { id: true, sessionId: true }
    });

    if (!seatReservation) {
      return Response.json(
        {
          error: "Nie znaleziono rezerwacji dla tego miejsca."
        },
        { status: 404 }
      );
    }

    if (seatReservation.sessionId !== buySession.id) {
      return Response.json(
        {
          error: "To miejsce zostało zarezerwowane przez innego użytkownika."
        },
        { status: 400 }
      );
    }

    if (seatReservation.sessionId !== buySession.id) {
      return Response.json(
        {
          error: "Nie masz uprawnień do anulowania tej rezerwacji."
        },
        { status: 403 }
      );
    }

    await prisma.seatReservation.delete({
      where: {
        id: seatReservation.id
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
