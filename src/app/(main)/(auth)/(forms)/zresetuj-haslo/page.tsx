import Reset from "@/app/(main)/(auth)/(forms)/zresetuj-haslo/Reset";
import { Suspense } from "react";

export default async function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reset />
    </Suspense>
  );
}
