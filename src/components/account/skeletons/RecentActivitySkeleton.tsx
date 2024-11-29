import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <li key={index} className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
