import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia konta</CardTitle>
        <CardDescription>Zarządzaj swoimi ustawieniami konta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-9" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
        <Separator />
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
