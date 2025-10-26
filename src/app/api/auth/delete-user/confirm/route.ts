import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserActivities } from "@prisma/client";
import { auth } from "@/lib/auth/auth";

/**
 * Callback to track account deletion before Better Auth deletes the user
 * This should be called before the actual deletion
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find the verification token
    const verification = await prisma.verification.findFirst({
      where: { value: token }
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Extract userId from identifier (Better Auth format)
    const userId = verification.identifier.split(":")[0];

    // Track account deletion activity BEFORE deletion
    await prisma.userActivity.create({
      data: {
        userId,
        type: UserActivities.DELETED_ACCOUNT
      }
    });

    // Now let Better Auth handle the actual deletion
    // The activity will persist due to onDelete: NoAction in schema
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking account deletion:", error);
    return NextResponse.json(
      { error: "Failed to process deletion" },
      { status: 500 }
    );
  }
}
