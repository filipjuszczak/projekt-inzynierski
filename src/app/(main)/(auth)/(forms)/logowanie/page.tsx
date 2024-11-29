import Link from "next/link";
import LoginForm from "@/app/(main)/(auth)/(forms)/logowanie/LoginForm";

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
