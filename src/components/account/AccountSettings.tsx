import Link from "next/link";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
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
import { getUserAccountSettings } from "@/app/(main)/konto/data";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import { cn } from "@/lib/utils";

export default async function AccountSettings() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/logowanie");
  }

  const userAccountSettings = await getUserAccountSettings(user.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia konta</CardTitle>
        <CardDescription>Zarządzaj swoimi ustawieniami konta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ChangeAccountSettingsForm
          userId={user.id}
          newsletterConsent={userAccountSettings.newsletterConsent}
        />
        <Separator />
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="font-semibold leading-none tracking-tight">
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
            <div className="font-semibold leading-none tracking-tight">
              Usuń konto
            </div>
            <DeleteAccountButton userId={user.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
