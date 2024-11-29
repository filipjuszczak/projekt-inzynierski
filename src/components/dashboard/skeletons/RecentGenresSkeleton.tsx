import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentGenresSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ostatnio dodane gatunki</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-1 h-8 w-[50px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
