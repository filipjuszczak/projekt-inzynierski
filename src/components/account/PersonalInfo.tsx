"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import UpdateUserDataForm from "@/components/account/UpdateUserDataForm";
import PersonalInfoSkeleton from "@/components/account/skeletons/PersonalInfoSkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { authClient } from "@/lib/auth/auth-client";

export default function PersonalInfo() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <PersonalInfoSkeleton />;
  }

  if (error) {
    return <ErrorCard />;
  }

  if (session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twoje dane</CardTitle>
          <CardDescription>Zaktualizuj swoje dane</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateUserDataForm />
        </CardContent>
      </Card>
    );
  }
}
