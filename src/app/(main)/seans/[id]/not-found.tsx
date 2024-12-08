import Link from "next/link";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-4">
      <Frown className="size-10 text-muted-foreground" />
      <h1 className="mb-8 text-3xl font-bold">Nie znaleziono seansu.</h1>
      <Button asChild>
        <Link href="/repertuar">&larr; Repertuar</Link>
      </Button>
    </div>
  );
}
