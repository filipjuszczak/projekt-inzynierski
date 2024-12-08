import { addDays } from "date-fns";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("secret");

    if (secret !== process.env.AUTH_API_SECREY_KEY) {
      return Response.json({ error: "Unauthorized" });
    }

    const now = new Date();
    const expiresAt = addDays(now, 1);

    const session = await prisma.session.create({
      data: {
        expiresAt
      },
      select: {
        id: true
      }
    });

    return Response.json({
      sessionId: session.id,
      expiresAt: expiresAt.getTime()
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
