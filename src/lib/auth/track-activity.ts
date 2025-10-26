import prisma from "@/lib/prisma";
import { UserActivities } from "@prisma/client";

export async function trackUserActivity(
  userId: string,
  activityType: UserActivities
) {
  try {
    await prisma.userActivity.create({
      data: {
        userId,
        type: activityType
      }
    });
  } catch (error) {
    console.error("Error tracking user activity:", error);
  }
}

export async function trackUserActivityClient(activityType: UserActivities) {
  try {
    await fetch("/api/user-activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType })
    });
  } catch (error) {
    console.error("Error tracking user activity:", error);
  }
}
