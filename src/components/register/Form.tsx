import Link from "next/link";
import SignupForm from "@/components/register/SignupForm";

interface FormProps {
  onSuccessfulSignup: () => void;
}

export default function Form({ onSuccessfulSignup }: FormProps) {
  return (
    <div>
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
