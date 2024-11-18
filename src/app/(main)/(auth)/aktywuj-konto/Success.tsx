"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";

export default function Success() {
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
      <p>
        Zostaniesz przeniesiony na stronę logowania za {countdown} sekund...
      </p>
    </>
  );
}
