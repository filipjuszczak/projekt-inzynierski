"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useFetchRooms } from "@/app/(staff)/staff/dashboard/(main)/rooms/queries";

export default function RoomList() {
  const { data: roomsData, isPending } = useFetchRooms();

  return (
    <div>
      {isPending && <Loader />}
      {roomsData && roomsData.length === 0 && <NotFound />}
      {roomsData && roomsData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numer sali</TableHead>
              <TableHead>Liczba rzędów</TableHead>
              <TableHead>Liczba miejsc w rzędzie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomsData.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.number}</TableCell>
                <TableCell>{room.numberOfRows}</TableCell>
                <TableCell>{room.seatsPerRow}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/staff/dashboard/rooms/${room.id}/edit`}>
                        <DropdownMenuItem>Edytuj</DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
