import { NextResponse, type NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { session, user } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );

    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userData, recentUserActivity] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { newsletterConsent: true, createdAt: true }
      }),
      prisma.userActivity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          type: true,
          createdAt: true
        },
        take: 3
      })
    ]);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = [];

    for (const activity of recentUserActivity) {
      result.push({
        // icon: USER_ACTIVITIES[activity.type].icon,
        // text: USER_ACTIVITIES[activity.type].text,
        type: activity.type,
        date: activity.createdAt
      });
    }

    return NextResponse.json({
      userData: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        newsletterConsent: userData.newsletterConsent,
        createdAt: userData.createdAt
      },
      recentUserActivity: result
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
