import { Frown } from "lucide-react";
import Reset from "@/app/(main)/(auth)/(forms)/zresetuj-haslo/Reset";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    step: "request" | "set-password";
    email: string;
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams
}: ResetPasswordPageProps) {
  const { step, email, token } = await searchParams;

  const isSetPasswordStep = step === "set-password";
  const isInvalidParams = isSetPasswordStep && (!email || !token);

  if (step === "request" || (isSetPasswordStep && !isInvalidParams)) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24 md:px-0">
        <Reset email={email} token={token} />
      </main>
    );
  }

  return (
    <main className="flex flex-grow items-center justify-center">
      <div className="space-y-4 text-center">
        <Frown className="mx-auto size-10" />
        <h1 className="text-2xl font-bold">Ups! Coś poszło nie tak...</h1>
        <p>Brak wymaganych parametrów w adresie URL.</p>
      </div>
    </main>
  );
}
