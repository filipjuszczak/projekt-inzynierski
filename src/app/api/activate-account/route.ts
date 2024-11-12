import prisma from "@/lib/prisma";
import { TokenType } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({ error: "Brak tokenu." }, { status: 400 });
    }

    const existingToken = await prisma.token.findFirst({
      where: { value: token, type: TokenType.ACTIVATION }
    });

    if (!existingToken) {
      return Response.json({ error: "Nieprawidłowy token." }, { status: 400 });
    }

    if (!existingToken.isActive) {
      return Response.json(
        { error: "Token został już użyty." },
        { status: 400 }
      );
    }

    const tokenExpirationDate = new Date(existingToken.expiresAt);

    if (tokenExpirationDate < new Date()) {
      return Response.json({ error: "Token wygasł." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.token.update({
        where: { id: existingToken.id },
        data: { isActive: false }
      }),
      prisma.user.update({
        where: { id: existingToken.userId },
        data: { isActivated: true }
      })
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
