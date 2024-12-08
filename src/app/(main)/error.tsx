"use client";

import { Frown } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Frown className="size-10 text-muted-foreground" />
        <p className="text-xl">
          Ups! Coś poszło nie tak... Spróbuj ponownie później.
        </p>
      </div>
    </main>
  );
}
