"use client";

import { useSearchParams } from "next/navigation";
import SetNewPasswordForm from "@/app/(auth)/(forms)/zresetuj-haslo/SetNewPasswordForm";
import ResetPasswordForm from "@/app/(auth)/(forms)/zresetuj-haslo/ResetPasswordForm";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        {token ? (
          <>
            <h1>Ustaw nowe hasło</h1>
            <SetNewPasswordForm token={token} />
          </>
        ) : (
          <>
            <h1>Zresetuj hasło</h1>
            <ResetPasswordForm />
          </>
        )}
      </div>
    </main>
  );
}
