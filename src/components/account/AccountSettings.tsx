"use client";

import Link from "next/link";
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
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export default function AccountSettings() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <AccountSettingsSkeleton />;
  }

  if (error) {
    return <ErrorCard />;
  }

  if (session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ustawienia konta</CardTitle>
          <CardDescription>
            Zarządzaj ustawieniami swojego konta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ChangeAccountSettingsForm />
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
              <DeleteAccountButton />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
