import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="size-4 animate-spin" />
      Ładowanie...
    </div>
  );
}
