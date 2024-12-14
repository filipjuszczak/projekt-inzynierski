import { Frown } from "lucide-react";
import Reset from "@/components/reset-password/Reset";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zresetuj hasło",
  description: "Zresetuj hasło do swojego konta.",
  openGraph: {
    title: "Zresetuj hasło | Sunema",
    description: "Zresetuj hasło do swojego konta."
  }
};

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
