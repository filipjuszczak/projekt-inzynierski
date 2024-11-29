import { Skeleton } from "@/components/ui/skeleton";

export default function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <Skeleton className="mb-2 h-6 w-24" />
          <div className="space-y-2">
            {[...Array(4)].map((_, subIndex) => (
              <div key={subIndex} className="flex items-center">
                <Skeleton className="mr-2 h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
