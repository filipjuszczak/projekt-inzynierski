import { Calendar, Clapperboard, Ticket } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie rezerwacji</CardTitle>
        <CardDescription>Twoja aktywność w skrócie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center md:flex-col lg:flex-row">
            <Ticket className="mr-2 h-5 w-5 text-primary" />
            <div className="text-sm font-medium">Liczba rezerwacji:</div>
          </div>
          <div className="flex items-center md:flex-col lg:flex-row">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            <div className="text-sm font-medium">Nadchodzące seanse:</div>
          </div>
          <div className="flex items-center md:flex-col lg:flex-row">
            <Clapperboard className="mr-2 h-5 w-5 text-primary" />
            <div className="text-sm font-medium">Ulubiony gatunek:</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
