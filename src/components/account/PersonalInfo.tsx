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
import { useAccountData } from "@/app/(main)/konto/queries";

export default function PersonalInfo() {
  const { data, isLoading, isError } = useAccountData();

  if (isLoading) {
    return <PersonalInfoSkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twoje dane</CardTitle>
          <CardDescription>Zaktualizuj swoje dane</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateUserDataForm
            id={data.userData.id}
            username={data.userData.username || ""}
            firstName={data.userData.firstName}
            lastName={data.userData.lastName}
            email={data.userData.email}
            dateOfBirth={new Date(data.userData.dateOfBirth)}
          />
        </CardContent>
      </Card>
    );
  }
}
