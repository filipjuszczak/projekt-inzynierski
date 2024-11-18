"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile } from "lucide-react";
import SignupForm from "@/app/(main)/(auth)/(forms)/rejestracja/SignupForm";

export default function SignupPage() {
  const [hasSuccessfullySignedUp, setHasSuccessfullySignedUp] = useState(false);

  return (
    <div className="flex flex-grow items-center justify-center">
      {hasSuccessfullySignedUp ? (
        <Success />
      ) : (
        <Form onSuccessfulSignup={() => setHasSuccessfullySignedUp(true)} />
      )}
    </div>
  );
}

function Success() {
  return (
    <div className="space-y-4 text-center">
      <Smile className="mx-auto size-10" />
      <h1>Konto zostało pomyślnie utworzone!</h1>
      <p>Sprawdź swoją skrzynkę e-mail, aby aktywować konto.</p>
    </div>
  );
}

interface FormProps {
  onSuccessfulSignup: () => void;
}

function Form({ onSuccessfulSignup }: FormProps) {
  return (
    <div className="w-96">
      <h1 className="pb-8 text-center text-3xl font-bold">Zarejestruj się</h1>
      <SignupForm onSuccessfulSignup={onSuccessfulSignup} />
      <div className="pt-4">
        Masz już konto?{" "}
        <Link href="/logowanie" className="underline">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}
