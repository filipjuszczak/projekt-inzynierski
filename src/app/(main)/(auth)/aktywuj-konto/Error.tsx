"use client";

import { toast } from "sonner";
import { Frown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestNewToken } from "@/app/(main)/(auth)/aktywuj-konto/actions";
import { useTransition } from "react";

interface ErrorProps {
  message: string | null;
  canRequestNewToken: boolean;
  email?: string;
  token?: string;
}

export default function Error({
  message,
  canRequestNewToken,
  email,
  token
}: ErrorProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (!email || !token) return;

      const result = await requestNewToken(email);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success(
          "Nowy link aktywacyjny został wysłany na Twój adres e-mail."
        );
      } else {
        toast.error("Wystąpił nieoczekiwany błąd.");
      }
    });
  }

  return (
    <>
      {canRequestNewToken ? (
        <>
          <Frown className="mx-auto size-10" />
          <h1 className="text-2xl font-bold">Ups! Coś poszło nie tak...</h1>
          {message ? (
            <>
              <p>{message}</p>
              <Button onClick={handleClick} disabled={isPending}>
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
          <h1 className="text-2xl font-bold">Ups! Coś poszło nie tak...</h1>
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
