import { CircleAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center gap-2">
      <CircleAlert className="size-4" />
      Brak danych...
    </div>
  );
}
