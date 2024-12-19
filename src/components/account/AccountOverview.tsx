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
import { useAccountData } from "@/app/(main)/konto/queries";

export default function AccountOverview() {
  const { data, isLoading, isError } = useAccountData();

  if (isLoading) {
    return <AccountOverviewSkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
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
              {data.userData.firstName} {data.userData.lastName}
            </h2>
            <p className="text-gray-500">{data.userData.email}</p>
            <p className="text-sm text-gray-500">
              Członek od: {format(data.userData.createdAt, "dd.MM.yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}
