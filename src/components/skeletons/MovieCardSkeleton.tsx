import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <Card className="mx-auto flex w-[80%] flex-col min-[640px]:w-full">
      <Skeleton className="aspect-[2/3] w-full" />
      <CardContent className="space-y-2 p-4 pb-10">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-[22px] w-[90px]" />
        <Skeleton className="h-14 w-full" />
      </CardContent>
      <CardFooter className="mt-auto px-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
