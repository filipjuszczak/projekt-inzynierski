"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowUpDown, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useFetchShowtimes } from "@/app/(staff)/staff/dashboard/(management)/showtimes/queries";
import { deleteShowtime } from "@/app/(staff)/staff/dashboard/(management)/showtimes/actions";
import type { Showtime } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

function createColumns(
  handleDeleteShowtime: (showtimeId: string) => void
): ColumnDef<Showtime>[] {
  return [
    {
      accessorKey: "movie.title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tytuł filmu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "room.number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sala
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar className="size-4" />
            Data rozpoczęcia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("startTime")), "dd.MM.yyyy HH:mm");
      }
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar className="size-4" />
            Data zakończenia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("endTime")), "dd.MM.yyyy HH:mm");
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const showtimeId = row.original.id;

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
                  <Link href={`/staff/dashboard/showtimes/${showtimeId}`}>
                    Wyświetl szczegóły
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/staff/dashboard/showtimes/${showtimeId}/edit`}>
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
                  Czy na pewno chcesz usunąć seans?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest nieodwracalna.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteShowtime(showtimeId)}
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

interface ShowtimesTableProps {
  data: Showtime[];
}

export default function ShowtimesTable({ data }: ShowtimesTableProps) {
  const queryClient = useQueryClient();

  async function handleDeleteShowtime(showtimeId: string) {
    const result = await deleteShowtime(showtimeId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      await queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      toast.success("Seans został usunięty.");
    } else {
      toast.error("Wystąpił błąd podczas usuwania seansu.");
    }
  }

  const columns = createColumns(handleDeleteShowtime);

  return <DataTable columns={columns} data={data} />;
}
