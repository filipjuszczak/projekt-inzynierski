import UpcomingShowtimesSkeleton from "@/components/dashboard/skeletons/UpcomingShowtimesSkeleton";
import RecentGenresSkeleton from "@/components/dashboard/skeletons/RecentGenresSkeleton";
import RecentMoviesSkeleton from "@/components/dashboard/skeletons/RecentMoviesSkeleton";
import QuickStatsSkeleton from "@/components/dashboard/skeletons/QuickStatsSkeleton";

export default function DashboardSkeleton() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Panel główny</h1>
      <QuickStatsSkeleton />
      <UpcomingShowtimesSkeleton />
      <RecentGenresSkeleton />
      <RecentMoviesSkeleton />
    </div>
  );
}
