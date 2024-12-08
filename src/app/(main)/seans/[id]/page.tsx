import { notFound } from "next/navigation";
import OrderTickets from "@/components/showtimes/OrderTickets";
import {
  getEssentialShowtimeDataById,
  getTickets
} from "@/app/(main)/seans/[id]/data";

interface ShowtimePageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowtimePage({ params }: ShowtimePageProps) {
  const { id } = await params;
  const [showtime, tickets] = await Promise.all([
    getEssentialShowtimeDataById(id),
    getTickets()
  ]);

  if (!showtime) {
    notFound();
  }

  return (
    <main className="container mx-auto my-24 space-y-12 px-4">
      <OrderTickets showtime={showtime} tickets={tickets} />
    </main>
  );
}
