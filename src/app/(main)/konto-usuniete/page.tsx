import Link from "next/link";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountDeletedPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-4">
      <Frown className="size-10 text-muted-foreground" />
      <h1 className="text-3xl font-bold">Twoje konto zostało usunięte.</h1>
      <p>
        Utwórz nowe konto, jeśli chcesz z powrotem korzystać z usług naszego
        kina.
      </p>
      <Button asChild>
        <Link href="/">Wróć na stronę główną</Link>
      </Button>
    </div>
  );
}
