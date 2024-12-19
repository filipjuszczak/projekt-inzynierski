import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationsListItemsSkeleton() {
  return (
    <ul className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <li key={index} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-[42px] md:w-[152px]" />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-[132px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-[132px]" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[132px]" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
