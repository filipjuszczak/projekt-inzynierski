import { Skeleton } from "@/components/ui/skeleton";

export default function ShowtimeFiltersSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="h-16 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9" />
      </div>
    </div>
  );
}
