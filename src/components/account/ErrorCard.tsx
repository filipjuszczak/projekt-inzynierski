import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ErrorCard() {
  return (
    <Card className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <CircleAlert className="size-6 text-red-500" />
        <p className="text-sm text-red-500">
          Wystąpił błąd podczas pobierania danych.
        </p>
      </div>
    </Card>
  );
}
