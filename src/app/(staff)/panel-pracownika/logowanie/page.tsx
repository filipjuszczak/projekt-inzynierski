import LoginForm from "@/components/dashboard/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do panelu pracownika."
};

export default function DashboardLoginPage() {
  return (
    <main className="flex flex-grow items-center justify-center">
      <div className="my-24">
        <LoginForm />
      </div>
    </main>
  );
}
