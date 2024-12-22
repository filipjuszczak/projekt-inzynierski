"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import ChangeAccountSettingsForm from "@/components/account/ChangeAccountSettingsForm";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";
import AccountSettingsSkeleton from "@/components/account/skeletons/AccountSettingsSkeleton";
import ErrorCard from "@/components/account/ErrorCard";
import { useAccountData } from "@/app/(main)/konto/queries";
import { cn } from "@/lib/utils";

export default function AccountSettings() {
  const { data, isLoading, isError } = useAccountData();

  if (isLoading) {
    return <AccountSettingsSkeleton />;
  }

  if (isError) {
    return <ErrorCard />;
  }

  if (data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ustawienia konta</CardTitle>
          <CardDescription>Zarządzaj swoimi ustawieniami konta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ChangeAccountSettingsForm
            userId={data.userData.id}
            newsletterConsent={data.userData.newsletterConsent || false}
          />
          <Separator />
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="w-fit font-semibold leading-none tracking-tight">
                Zmień hasło do swojego konta
              </div>
              <Link
                href="/konto/zmien-haslo"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Zmień hasło
              </Link>
            </div>
            <div className="space-y-4">
              <div className="w-fit font-semibold leading-none tracking-tight">
                Usuń konto
              </div>
              <DeleteAccountButton userId={data.userData.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
