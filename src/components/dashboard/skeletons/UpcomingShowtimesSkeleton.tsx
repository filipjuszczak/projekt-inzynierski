import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingShowtimesSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[150px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-between border-b pb-4 md:flex-row md:items-center"
              >
                <Skeleton className="mb-2 h-6 w-[200px] md:mb-0" />
                <div className="flex flex-wrap gap-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8 w-20" />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
