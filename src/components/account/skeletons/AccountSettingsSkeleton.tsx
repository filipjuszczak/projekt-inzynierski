import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="pt-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
