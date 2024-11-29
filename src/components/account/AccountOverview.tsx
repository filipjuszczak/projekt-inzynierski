import { redirect } from "next/navigation";
import { format } from "date-fns";
import { User } from "lucide-react";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";

export default async function AccountOverview() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/logowanie");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Przegląd konta</CardTitle>
        <CardDescription>Podsumowanie Twojego konta</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="flex h-20 w-20 items-center justify-center">
          <User className="size-10" />
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">
            Członek od: {format(user.createdAt, "dd.MM.yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
