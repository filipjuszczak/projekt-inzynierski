import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";

export default async function ChangePasswordPage() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/panel-pracownika/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/panel-pracownika/logowanie");
  }

  return (
    <main className="container mx-auto flex flex-grow items-center justify-center py-10">
      <ChangePasswordForm userId={user.id} role={Role.NORMAL} />
    </main>
  );
}
