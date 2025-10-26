"use client";

import { format } from "date-fns";
import { CircleAlert, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import AccountOverviewSkeleton from "@/components/account/skeletons/AccountOverviewSkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { authClient } from "@/lib/auth/auth-client";

export default function AccountOverview() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <AccountOverviewSkeleton />;
  }

  if (error) {
    return <ErrorCard />;
  }

  if (session) {
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
            <h2 className="text-2xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-500">{session.user.email}</p>
            <p className="text-sm text-gray-500">
              Członek od: {format(session.user.createdAt, "dd.MM.yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}
