import { notFound } from "next/navigation";
import { Frown } from "lucide-react";
import OrderTickets from "@/components/showtimes/OrderTickets";
import {
  getEssentialShowtimeDataById,
  getTickets
} from "@/app/(main)/seans/[id]/data";
import type { Metadata } from "next";

interface ShowtimePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Kup bilet na seans",
  description: "Kup lub zarezerwuj bilety na wybrany seans w naszym kinie.",
  openGraph: {
    title: "Kup bilet na seans | Sunema",
    description: "Kup lub zarezerwuj bilety na wybrany seans w naszym kinie."
  }
};

export default async function ShowtimePage({ params }: ShowtimePageProps) {
  const { id } = await params;
  const [showtime, tickets] = await Promise.all([
    getEssentialShowtimeDataById(id),
    getTickets()
  ]);

  if (!showtime) {
    notFound();
  }

  if (showtime.startTime < new Date()) {
    return (
      <main className="container flex flex-grow items-center justify-center">
        <div className="space-y-8">
          <Frown className="mx-auto size-10 text-muted-foreground" />
          <h1 className="text-3xl font-bold">
            Ups! Ten seans już się rozpoczął. Nie można kupić biletów.
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto my-24 space-y-4 px-4">
      <OrderTickets showtime={showtime} tickets={tickets} />
    </main>
  );
}
