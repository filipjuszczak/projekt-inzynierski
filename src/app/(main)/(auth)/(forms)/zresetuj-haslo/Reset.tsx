"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SetNewPasswordForm from "@/app/(main)/(auth)/(forms)/zresetuj-haslo/SetNewPasswordForm";
import ResetPasswordForm from "@/app/(main)/(auth)/(forms)/zresetuj-haslo/ResetPasswordForm";

interface ResetProps {
  email: string;
  token: string;
}

export default function Reset({ email, token }: ResetProps) {
  const router = useRouter();

  const [countdown, setCountdown] = useState(5);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (countdownStarted) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        router.push("/logowanie");
      }

      return () => clearInterval(timer);
    }
  }, [countdownStarted, countdown, router]);

  function handleShowAlert() {
    setIsAlertVisible(true);
  }

  function handleStartCountdown() {
    setCountdownStarted(true);
  }

  return (
    <div className="max-w-md space-y-4">
      {isAlertVisible ? (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertTitle>Udało się!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Wysłaliśmy link resetujący hasło na podany adres e-mail.
          </AlertDescription>
        </Alert>
      ) : countdownStarted ? (
        <Alert>
          <CircleCheck className="h-4 w-4" />
          <AlertTitle>Udało się!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Hasło zostało zmienione. Przekierujemy Cię na stronę logowania za{" "}
            {countdown} sekund.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="space-y-4">
          {email && token ? (
            <>
              <CardHeader>
                <CardTitle className="text-3xl font-semibold">
                  Ustaw nowe hasło
                </CardTitle>
                <CardDescription>
                  Ustaw nowe hasło, aby odzyskać dostęp do swojego konta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetNewPasswordForm
                  email={email}
                  token={token}
                  onSuccess={handleStartCountdown}
                />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-3xl font-semibold">
                  Zresetuj hasło
                </CardTitle>
                <CardDescription>
                  Wpisz adres e-mail, aby wysłać prośbę o zresetowanie hasła.
                  Link resetujący hasło wyślemy na Twoją pocztę e-mail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResetPasswordForm onSuccess={handleShowAlert} />
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
