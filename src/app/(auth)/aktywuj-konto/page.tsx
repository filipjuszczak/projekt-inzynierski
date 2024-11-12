"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Smile, Frown, Loader2 } from "lucide-react";
import {
  useActivateAccountMutation,
  useGenerateNewTokenMutation
} from "@/app/(auth)/aktywuj-konto/mutations";
import { Button } from "@/components/ui/button";

export default function ConfirmPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useActivateAccountMutation(token);

  useEffect(() => {
    if (token) {
      mutate(undefined, {
        onSuccess: () => {
          setIsActivated(true);
          toast.success("Twoje konto zostało aktywowane!");
        },
        onError: (error) => {
          setIsActivated(false);
          setError(error.message);
          toast.error(error.message);
        }
      });
    }
  }, [token, mutate]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        {isActivated ? <Success /> : <Error message={error} />}
      </div>
    </main>
  );
}

function Success() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      router.push("/logowanie");
    }

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <>
      <Smile className="mx-auto size-10" />
      <h1 className="text-2xl">Twoje konto zostało aktywowane!</h1>
      <p>Zostaniesz przeniesiony na stronę główną za {countdown} sekund...</p>
    </>
  );
}

interface ErrorProps {
  message: string | null;
}

function Error({ message }: ErrorProps) {
  const params = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");

  const { mutate, data, isPending } = useGenerateNewTokenMutation(email, token);

  function handleClick() {
    // if (data) return;

    mutate(undefined, {
      onSuccess: () => {
        toast.success(
          "Nowy link aktywacyjny został wysłany na Twój adres e-mail."
        );
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  }

  return (
    <>
      {message === "Token wygasł." ? (
        <>
          <Frown className="mx-auto size-10" />
          <h1 className="text-2xl">Ups! Coś poszło nie tak...</h1>
          {message ? (
            <>
              <p>{message}</p>
              <Button onClick={handleClick} disabled={isPending || data}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generowanie nowego linku...
                  </>
                ) : (
                  "Wygeneruj nowy link"
                )}
              </Button>
            </>
          ) : (
            <Loader2 className="mx-auto size-10 animate-spin" />
          )}
        </>
      ) : (
        <>
          <Frown className="mx-auto size-10" />
          <h1 className="text-2xl">Ups! Coś poszło nie tak...</h1>
          {message ? (
            <p>{message}</p>
          ) : (
            <Loader2 className="mx-auto size-10 animate-spin" />
          )}
        </>
      )}
    </>
  );
}
