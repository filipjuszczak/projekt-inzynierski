import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = (await params).id;
    const room = await prisma.room.findFirst({
      where: { id: roomId },
      select: {
        id: true,
        number: true,
        numberOfRows: true,
        seatsPerRow: true
      }
    });

    return Response.json(room);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
