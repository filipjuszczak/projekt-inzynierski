import { Skeleton } from "@/components/ui/skeleton";

export default function ShowtimeFiltersSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <Skeleton className="flex-1" />
      <Skeleton className="flex-1" />
      <Skeleton className="flex-1" />
    </div>
  );
}
