import { Smile } from "lucide-react";

export default function SuccessfulSignup() {
  return (
    <div className="space-y-4 text-center">
      <Smile className="mx-auto size-10" />
      <h1>Konto zostało pomyślnie utworzone!</h1>
      <p>Sprawdź swoją skrzynkę e-mail, aby aktywować konto.</p>
    </div>
  );
}
