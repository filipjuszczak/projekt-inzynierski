import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="space-y-4">
        <Frown className="mx-auto size-10" />
        <h1 className="text-center text-4xl font-bold">404 Not Found</h1>
        <p>Ups! Nie udało się nam znaleźć zasobu, którego szukasz.</p>
      </div>
    </main>
  );
}
