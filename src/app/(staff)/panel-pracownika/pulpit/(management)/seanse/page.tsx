import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShowtimesTable from "@/components/dashboard/showtimes/ShowtimesTable";
import { getShowtimes } from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seanse"
};

export default async function ShowtimesPage() {
  const showtimes = await getShowtimes();

  return (
    <div className="flex-grow space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Seanse</h1>
        <Button asChild>
          <Link href="/panel-pracownika/pulpit/seanse/nowy">
            <PlusCircle />
            Nowy
          </Link>
        </Button>
      </div>
      <ShowtimesTable data={showtimes} />
    </div>
  );
}
