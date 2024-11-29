"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, MoreVertical } from "lucide-react";
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
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { deleteRoom } from "@/app/(staff)/panel-pracownika/pulpit/(management)/sale/actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { Room } from "@/lib/types";

function createColumns(
  handleDeleteRoom: (roomId: string) => void
): ColumnDef<Room>[] {
  return [
    {
      accessorKey: "number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Numer sali
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "numberOfRows",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Liczba rzędów
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "seatsPerRow",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Liczba miejsc w rzędzie
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const roomId = row.original.id;

        return (
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
                  <Link href={`/panel-pracownika/pulpit/sale/${roomId}`}>
                    Wyświetl szczegóły
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/panel-pracownika/pulpit/sale/${roomId}/edytuj`}>
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
                  onClick={() => handleDeleteRoom(roomId)}
                  className="bg-red-600 text-white hover:bg-red-800"
                >
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      }
    }
  ];
}

interface RoomsTableProps {
  data: Room[];
}

export default function RoomsTable({ data }: RoomsTableProps) {
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

  const columns = createColumns(handleDeleteRoom);

  return <DataTable columns={columns} data={data} />;
}
