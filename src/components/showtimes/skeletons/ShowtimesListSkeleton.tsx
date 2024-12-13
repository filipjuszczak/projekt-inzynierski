import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowtimesListSkeleton() {
  return (
    <div className="space-y-6">
      <MovieCardSkeleton />
      <MovieCardSkeleton />
      <MovieCardSkeleton />
    </div>
  );
}

function MovieCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 *:w-full md:flex-row">
            <div className="relative aspect-[2/3] max-h-[400px] w-full max-w-[250px]">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="flex w-full flex-col gap-4">
              <Skeleton className="h-8 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-8 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
