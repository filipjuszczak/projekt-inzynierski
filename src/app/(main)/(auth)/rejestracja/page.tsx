import Signup from "@/components/register/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zarejestruj się",
  description:
    "Załóż konto w naszym serwisie, aby m.in. móc zapisywać historię swoich rezerwacji.",
  openGraph: {
    title: "Zarejestruj się | Sunema",
    description:
      "Załóż konto w naszym serwisie, aby m.in. móc zapisywać historię swoich rezerwacji."
  }
};

export default function SignupPage() {
  return <Signup />;
}
