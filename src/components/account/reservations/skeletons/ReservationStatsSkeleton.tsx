import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="mr-2 h-5 w-5" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
