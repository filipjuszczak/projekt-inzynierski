import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/dashboard/LoginForm";
import { auth } from "@/lib/auth/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do panelu pracownika."
};

export default async function DashboardLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.session.token) redirect("/panel-pracownika/pulpit");

  return (
    <main className="flex flex-grow items-center justify-center">
      <div className="my-24">
        <LoginForm />
      </div>
    </main>
  );
}
