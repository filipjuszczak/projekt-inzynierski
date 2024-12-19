import ReservationsList from "@/components/account/reservations/ReservationsList";
import ReservationsStats from "@/components/account/reservations/ReservationsStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moje rezerwacje",
  description: "Przeglądaj i anuluj swoje rezerwacje.",
  openGraph: {
    title: "Moje rezerwacje | Sunema",
    description: "Przeglądaj i anuluj swoje rezerwacje."
  }
};

export default async function ReservationsPage() {
  return (
    <div className="container mx-auto flex-grow px-4 py-10 2xl:px-0">
      <h1 className="mb-8 text-4xl font-bold">Moje rezerwacje</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReservationsList />
        </div>
        <div className="row-start-1 md:row-start-auto">
          <ReservationsStats />
        </div>
      </div>
    </div>
  );
}
