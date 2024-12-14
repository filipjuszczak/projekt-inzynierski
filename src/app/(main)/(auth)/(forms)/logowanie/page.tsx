import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do swojego konta.",
  openGraph: {
    title: "Zaloguj się | Sunema",
    description: "Zaloguj się do swojego konta."
  }
};

export default function LoginPage() {
  return (
    <main className="my-24 flex flex-grow items-center justify-center">
      <div>
        <LoginForm />
        <div className="pt-4 text-sm">
          <span className="text-muted-foreground">Nie masz konta?</span>{" "}
          <Link href="/rejestracja">Zarejestruj się</Link>
        </div>
      </div>
    </main>
  );
}
