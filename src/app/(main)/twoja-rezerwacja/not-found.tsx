import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-4">
      <Frown className="size-10 text-muted-foreground" />
      <h1 className="text-3xl font-bold">Nie znaleziono rezerwacji.</h1>
    </div>
  );
}
