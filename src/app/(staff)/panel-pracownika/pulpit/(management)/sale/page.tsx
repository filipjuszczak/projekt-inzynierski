import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RoomsTable from "@/components/dashboard/rooms/RoomsTable";
import { getRooms } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale"
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="flex-grow space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Sale</h1>
        <Button asChild>
          <Link href="/panel-pracownika/pulpit/sale/nowy">
            <PlusCircle />
            Nowy
          </Link>
        </Button>
      </div>
      <RoomsTable data={rooms} />;
    </div>
  );
}
