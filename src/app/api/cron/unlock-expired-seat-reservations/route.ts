import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("Authorization");

  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const seatReservations = await prisma.seatReservation.findMany({
      select: { id: true, createdAt: true }
    });

    const thirtyMinutesAgo = new Date(Date.now() - 1000 * 60 * 30);

    const seatReservationsToDelete = seatReservations.filter(
      (seatReservation) => seatReservation.createdAt < thirtyMinutesAgo
    );

    await prisma.seatReservation.deleteMany({
      where: { id: { in: seatReservationsToDelete.map((sr) => sr.id) } }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
