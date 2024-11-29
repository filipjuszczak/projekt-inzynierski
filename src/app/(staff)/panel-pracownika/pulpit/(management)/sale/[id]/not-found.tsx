import Link from "next/link";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-4">
      <Frown className="size-10 text-muted-foreground" />
      <h1 className="mb-8 text-3xl font-bold">Nie znaleziono sali.</h1>
      <Button asChild>
        <Link href="/panel-pracownika/pulpit/gatunki">&larr; Wróć</Link>
      </Button>
    </div>
  );
}
