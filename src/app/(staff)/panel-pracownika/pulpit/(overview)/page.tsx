import QuickStats from "@/app/(staff)/panel-pracownika/pulpit/(overview)/QuickStats";
import ShowtimesToday from "@/app/(staff)/panel-pracownika/pulpit/(overview)/ShowtimesToday";
import RecentGenres from "@/app/(staff)/panel-pracownika/pulpit/(overview)/RecentGenres";
import RecentMovies from "@/app/(staff)/panel-pracownika/pulpit/(overview)/RecentMovies";
import { authEmployee } from "@/lib/auth/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulpit"
};

export default async function DashboardPage() {
  await authEmployee({ returnRedirect: true });

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
