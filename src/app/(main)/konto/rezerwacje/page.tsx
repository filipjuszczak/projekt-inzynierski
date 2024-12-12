import { Suspense } from "react";
import ReservationsList from "@/components/account/reservations/ReservationsList";
import ReservationStats from "@/components/account/reservations/ReservationStats";
import ReservationsListSkeleton from "@/components/account/reservations/skeletons/ReservationsListSkeleton";
import ReservationStatsSkeleton from "@/components/account/reservations/skeletons/ReservationStatsSkeleton";

export default async function ReservationsPage() {
  return (
    <div className="container mx-auto flex-grow py-10">
      <h1 className="mb-8 text-4xl font-bold">Moje rezerwacje</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Suspense fallback={<ReservationsListSkeleton />}>
            <ReservationsList />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ReservationStatsSkeleton />}>
            <ReservationStats />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
