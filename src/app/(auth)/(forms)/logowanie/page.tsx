import Link from "next/link";
import LoginForm from "@/app/(auth)/(forms)/logowanie/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1>Logowanie</h1>
        <LoginForm />
        <div>
          Nie masz konta?{" "}
          <Link href="/rejestracja" className="underline">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </main>
  );
}
