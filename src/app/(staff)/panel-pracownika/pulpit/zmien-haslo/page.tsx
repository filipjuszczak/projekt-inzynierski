import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { getSessionCookie } from "@/lib/session";
import { authEmployee } from "@/lib/auth/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zmień hasło"
};

export default async function ChangePasswordPage() {
  await authEmployee({ returnRedirect: true });

  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-8">
      <ChangePasswordForm />
    </main>
  );
}
