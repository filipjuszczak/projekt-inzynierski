"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile } from "lucide-react";
import SignupForm from "@/app/(auth)/(forms)/rejestracja/SignupForm";

export default function SignupPage() {
  const [hasSuccessfullySignedUp, setHasSuccessfullySignedUp] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        {hasSuccessfullySignedUp ? (
          <div className="space-y-4 text-center">
            <Smile className="mx-auto size-10" />
            <h1>Konto zostało pomyślnie utworzone!</h1>
            <p>Sprawdź swoją skrzynkę e-mail, aby aktywować konto.</p>
          </div>
        ) : (
          <>
            <h1>Rejestracja</h1>
            <SignupForm
              onSuccessfulSignUp={() => setHasSuccessfullySignedUp(true)}
            />
            <div>
              Masz już konto?{" "}
              <Link href="/logowanie" className="underline">
                Zaloguj się
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
