import { NextResponse, NextRequest } from "next/server";
import { authUser } from "@/lib/auth/helpers";
import prisma from "@/lib/prisma";
import { UserActivities } from "@prisma/client";

export async function GET() {
  const data = await authUser();
  if (data instanceof NextResponse) return data;

  const userActivities = await prisma.userActivity.findMany({
    select: {
      id: true,
      type: true,
      createdAt: true
    },
    where: {
      userId: data.user.id
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 3
  });

  return Response.json(userActivities);
}

export async function POST(request: NextRequest) {
  const session = await authUser();
  if (session instanceof NextResponse) return session;

  try {
    const body = (await request.json()) as { activityType: UserActivities };
    const { activityType } = body;

    if (
      !activityType ||
      !Object.values(UserActivities).includes(activityType)
    ) {
      return NextResponse.json(
        { error: "Invalid activity type" },
        { status: 400 }
      );
    }

    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        type: activityType
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating user activity:", error);
    return NextResponse.json(
      { error: "Failed to track user activity" },
      { status: 500 }
    );
  }
}
