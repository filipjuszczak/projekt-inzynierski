import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountOverviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Przegląd konta</CardTitle>
        <CardDescription>Podsumowanie Twojego konta</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
