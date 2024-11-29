import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <Card className="flex w-full flex-col">
      <Skeleton className="aspect-[2/3] w-full" />
      <CardContent className="space-y-2 p-4 pb-10">
        <Skeleton className="h-7 w-24" />
        <div className="flex max-w-full justify-between gap-2 overflow-hidden">
          <Skeleton className="h-[22px] w-[90px]" />
          <Skeleton className="h-[22px] w-14" />
        </div>
        <Skeleton className="h-14 w-full" />
      </CardContent>
      <CardFooter className="mt-auto px-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
