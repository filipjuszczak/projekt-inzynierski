import Link from "next/link";
import LoginForm from "@/app/(main)/(auth)/(forms)/logowanie/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-grow items-center justify-center">
      <div>
        <h1 className="pb-8 text-center text-3xl font-bold">Zaloguj się</h1>
        <LoginForm />
        <div className="pt-4">
          Nie masz konta?{" "}
          <Link href="/rejestracja" className="underline">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </main>
  );
}
