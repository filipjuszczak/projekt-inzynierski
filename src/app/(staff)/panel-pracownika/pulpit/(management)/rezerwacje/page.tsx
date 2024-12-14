import { getReservations } from "@/app/(staff)/panel-pracownika/pulpit/(management)/rezerwacje/data";
import ReservationsTable from "@/components/dashboard/reservations/ReservationsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezerwacje"
};

export default async function OrdersPage() {
  const reservations = await getReservations();

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Rezerwacje</h1>
      <ReservationsTable data={reservations} />
    </div>
  );
}
