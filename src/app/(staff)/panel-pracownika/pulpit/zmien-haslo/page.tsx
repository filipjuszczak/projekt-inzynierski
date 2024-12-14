import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zmień hasło"
};

export default async function ChangePasswordPage() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/panel-pracownika/logowanie");
  }

  const { user, session } = await authenticateUser(
    Role.EMPLOYEE,
    sessionCookie
  );

  if (!user || !session || !session.userId) {
    redirect("/panel-pracownika/logowanie");
  }

  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-8">
      <ChangePasswordForm userId={user.id} role={Role.EMPLOYEE} />
    </main>
  );
}
