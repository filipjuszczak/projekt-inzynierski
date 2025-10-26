import ChangePasswordForm from "@/components/ChangePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zmień hasło",
  description: "Zmień hasło swojego konta w serwisie.",
  openGraph: {
    title: "Zmień hasło | Sunema",
    description: "Zmień hasło swojego konta w serwisie."
  }
};

export default async function ChangePasswordPage() {
  return (
    <main className="container mx-auto flex flex-grow items-center justify-center py-10">
      <ChangePasswordForm />
    </main>
  );
}
