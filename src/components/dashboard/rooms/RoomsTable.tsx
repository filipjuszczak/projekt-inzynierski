"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteRoom } from "@/app/(staff)/staff/dashboard/(management)/rooms/actions";
import type { Room } from "@/lib/types";

interface RoomsTableProps {
  rooms: Room[];
}

export default function RoomsTable({ rooms }: RoomsTableProps) {
  const queryClient = useQueryClient();

  async function handleDeleteRoom(roomId: string) {
    const result = await deleteRoom(roomId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Sala została usunięta.");
    } else {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numer sali</TableHead>
          <TableHead>Liczba rzędów</TableHead>
          <TableHead>Liczba miejsc w rzędzie</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.number}</TableCell>
            <TableCell>{room.numberOfRows}</TableCell>
            <TableCell>{room.seatsPerRow}</TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Otwórz menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/staff/dashboard/rooms/${room.id}`}>
                        Wyświetl szczegóły
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/staff/dashboard/rooms/${room.id}/edit`}>
                        Edytuj
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>
                        <span className="text-red-600">Usuń</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Czy na pewno chcesz usunąć salę?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ta operacja jest nieodwracalna.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anuluj</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteRoom(room.id)}
                      className="bg-red-600 text-white hover:bg-red-800"
                    >
                      Usuń
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
