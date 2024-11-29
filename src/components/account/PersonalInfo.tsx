import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import UpdateUserDataForm from "@/components/account/UpdateUserDataForm";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";

export default async function PersonalInfo() {
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
        <CardTitle>Twoje dane</CardTitle>
        <CardDescription>Zaktualizuj swoje dane</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateUserDataForm
          id={user.id}
          username={user.username || ""}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          dateOfBirth={user.dateOfBirth}
        />
      </CardContent>
    </Card>
  );
}
