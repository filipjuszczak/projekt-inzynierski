import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addMinutes } from "date-fns";
import prisma from "@/lib/prisma";

export async function POST() {
  const cookieJar = await cookies();
  const buySessionCookie = cookieJar.get("buy_session_id");

  let existingBuySession = null;

  if (buySessionCookie) {
    existingBuySession = await prisma.buySession.findFirst({
      select: {
        id: true,
        expiresAt: true
      },
      where: {
        id: buySessionCookie.value
      }
    });
  }

  const now = new Date();
  const needsNewSession =
    !existingBuySession || existingBuySession.expiresAt < now;

  if (needsNewSession) {
    const expiresAt = addMinutes(now, 15);
    const newBuySession = await prisma.buySession.create({
      data: { expiresAt },
      select: {
        id: true,
        expiresAt: true
      }
    });

    cookieJar.set("buy_session_id", newBuySession.id);
  }

  return NextResponse.json({ success: true });
}
