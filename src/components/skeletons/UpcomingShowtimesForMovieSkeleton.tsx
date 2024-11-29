import { Skeleton } from "@/components/ui/skeleton";

export default async function UpcomingShowtimesForMovieSkeleton() {
  return (
    <div className="space-y-12">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-7 w-16" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-9 w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
