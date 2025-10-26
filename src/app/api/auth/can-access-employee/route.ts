import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return NextResponse.json(
        { allowed: false, error: "Missing email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      select: {
        role: true
      },
      where: {
        email
      }
    });

    if (!user) {
      return NextResponse.json({ allowed: false });
    }

    const allowed = user.role === "employee" || user.role === "admin";

    return NextResponse.json({ allowed });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { allowed: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
