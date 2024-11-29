import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentMoviesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnio dodane filmy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <Skeleton className="mb-1 h-6 w-[150px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-[50px]" />
                    <Skeleton className="h-6 w-[50px]" />
                    <Skeleton className="h-6 w-[50px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
