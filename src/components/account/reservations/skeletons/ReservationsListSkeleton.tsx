import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReservationsListItemsSkeleton from "@/components/account/reservations/skeletons/ReservationsListItemsSkeleton";

export default function ReservationsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rezerwacje</CardTitle>
        <CardDescription>Przeglądaj swoje rezerwacje</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-9 w-full" />
        <ReservationsListItemsSkeleton />
      </CardContent>
    </Card>
  );
}
