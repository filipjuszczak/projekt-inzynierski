import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UpcomingShowtimesSkeleton from "@/components/skeletons/UpcomingShowtimesSkeleton";
import RecentGenresSkeleton from "@/components/skeletons/RecentGenresSkeleton";
import RecentMoviesSkeleton from "@/components/skeletons/RecentMoviesSkeleton";

export default function DashboardSkeleton() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Panel główny</h1>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[100px]" />
            </CardTitle>
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-[100px]" />
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[100px]" />
            </CardTitle>
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-[100px]" />
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[100px]" />
            </CardTitle>
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-[100px]" />
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
      </div>
      <UpcomingShowtimesSkeleton />
      <RecentGenresSkeleton />
      <RecentMoviesSkeleton />
    </div>
  );
}
