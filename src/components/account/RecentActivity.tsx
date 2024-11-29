import { redirect } from "next/navigation";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getRecentUserActivity } from "@/app/(main)/konto/data";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";

export default async function RecentActivity() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/logowanie");
  }

  const userActivity = await getRecentUserActivity(user.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnia aktywność</CardTitle>
        <CardDescription>Twoja ostatnia aktywność</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {userActivity.map((activity, index) => (
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
