import ShowtimesToday from "@/app/(staff)/panel-pracownika/pulpit/(overview)/ShowtimesToday";
import RecentGenres from "@/app/(staff)/panel-pracownika/pulpit/(overview)/RecentGenres";
import RecentMovies from "@/app/(staff)/panel-pracownika/pulpit/(overview)/RecentMovies";
import QuickStats from "@/app/(staff)/panel-pracownika/pulpit/(overview)/QuickStats";

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
