"use client";

import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { CircleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import RecentActivitySkeleton from "@/components/account/skeletons/RecentActivitySkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { USER_ACTIVITIES } from "@/lib/constants";
import { authClient } from "@/lib/auth/auth-client";
import { useUserActivities } from "@/app/(main)/konto/queries";

export default function RecentActivity() {
  const {
    data: session,
    isPending: sessionPending,
    error: sessionError
  } = authClient.useSession();
  const {
    data: userActivities,
    isPending: userActivitiesPending,
    error: userActivitiesError
  } = useUserActivities();

  if (sessionPending || userActivitiesPending) {
    return <RecentActivitySkeleton />;
  }

  if (sessionError || userActivitiesError) {
    return <ErrorCard />;
  }

  if (session && userActivities) {
    const recentUserActivity = userActivities.map((activity) => ({
      icon: USER_ACTIVITIES[activity.type].icon,
      text: USER_ACTIVITIES[activity.type].text,
      date: activity.createdAt
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
          <CardDescription>Twoja ostatnia aktywność</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUserActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak ostatnich aktywności.
            </p>
          ) : (
            <ul className="space-y-4">
              {recentUserActivity.map((activity, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <activity.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistance(activity.date, new Date(), {
                        addSuffix: true,
                        locale: pl
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  }
}
