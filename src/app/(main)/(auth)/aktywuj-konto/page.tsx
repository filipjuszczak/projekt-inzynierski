import { Frown } from "lucide-react";
import Success from "@/components/activate-account/Success";
import Error from "@/components/activate-account/Error";
import { activateAccount } from "@/app/(main)/(auth)/aktywuj-konto/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktywacja konta",
  description: "Aktywuj konto, aby móc korzystać z pełni możliwości serwisu.",
  openGraph: {
    title: "Aktywacja konta | Sunema",
    description: "Aktywuj konto, aby móc korzystać z pełni możliwości serwisu."
  }
};

interface ConfirmPasswordPageProps {
  searchParams: Promise<{ email: string; token: string }>;
}

export default async function ConfirmPasswordPage({
  searchParams
}: ConfirmPasswordPageProps) {
  const { email, token } = await searchParams;

  if (!email || !token) {
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

  const result = await activateAccount(email, token);

  if ("error" in result) {
    if ("canRequestNewToken" in result && result.canRequestNewToken) {
      return (
        <main className="flex flex-grow items-center justify-center">
          <div className="space-y-4 text-center">
            <Error
              message={result.error}
              canRequestNewToken={result.canRequestNewToken}
              email={email}
              token={token}
            />
          </div>
        </main>
      );
    } else {
      return (
        <main className="flex flex-grow items-center justify-center">
          <div className="space-y-4 text-center">
            <Error message={result.error} canRequestNewToken={false} />
          </div>
        </main>
      );
    }
  }

  if ("success" in result && result.success) {
    return (
      <main className="flex flex-grow items-center justify-center">
        <div className="space-y-4 px-4 text-center">
          <Success />
        </div>
      </main>
    );
  }
}
