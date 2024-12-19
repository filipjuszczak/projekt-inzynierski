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
import { useAccountData } from "@/app/(main)/konto/queries";
import { USER_ACTIVITIES } from "@/lib/constants";

export default function RecentActivity() {
  const { data, isLoading, isError } = useAccountData();

  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
    const recentUserActivity = data.recentUserActivity.map((activity) => ({
      icon: USER_ACTIVITIES[activity.type].icon,
      text: USER_ACTIVITIES[activity.type].text,
      date: activity.date
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
          <CardDescription>Twoja ostatnia aktywność</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }
}
