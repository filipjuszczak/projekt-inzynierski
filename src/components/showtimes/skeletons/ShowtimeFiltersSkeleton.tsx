import { Skeleton } from "@/components/ui/skeleton";

export default function ShowtimeFiltersSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="h-16 flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Data</div>
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Film</div>
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Gatunek filmu</div>
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Format ekranu</div>
        <Skeleton className="h-9" />
      </div>
      <div className="h-16 flex-1 space-y-2">
        <div className="w-fit text-sm text-muted-foreground">Rodzaj audio</div>
        <Skeleton className="h-9" />
      </div>
    </div>
  );
}
