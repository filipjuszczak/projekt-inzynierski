import ShowtimesToday from "@/app/(staff)/staff/dashboard/(overview)/ShowtimesToday";
import RecentGenres from "@/app/(staff)/staff/dashboard/(overview)/RecentGenres";
import RecentMovies from "@/app/(staff)/staff/dashboard/(overview)/RecentMovies";
import QuickStats from "@/app/(staff)/staff/dashboard/(overview)/QuickStats";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Panel główny</h1>
      <QuickStats />
      <ShowtimesToday />
      <RecentGenres />
      <RecentMovies />
    </div>
  );
}
