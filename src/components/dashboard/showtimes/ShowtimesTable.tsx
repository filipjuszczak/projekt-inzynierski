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
import { Badge } from "@/components/ui/badge";
import {
  deleteShowtime,
  markShowtimeAsFinished,
  markShowtimeAsOngoing
} from "@/app/(staff)/panel-pracownika/pulpit/(management)/seanse/actions";
import {
  SCREEN_FORMAT_LABELS,
  SHOWTIME_STATUS_LABELS,
  VIEWING_MODE_LABELS
} from "@/lib/constants";
import type { ShowtimeData } from "@/lib/types";
import { useRouter } from "next/navigation";

type Columns = ColumnDef<ShowtimeData>[];

function createColumns(
  handleDeleteShowtime: (showtimeId: string) => void,
  handleMarkShowtimeAsOngoing: (showtimeId: string) => void,
  handleMarkShowtimeAsFinished: (showtimeId: string) => void
): Columns {
  return [
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant="outline">{SHOWTIME_STATUS_LABELS[status]}</Badge>
        );
      }
    },
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
      accessorKey: "viewingMode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rodzaj audio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const viewingMode = row.original.viewingMode;
        return <Badge>{VIEWING_MODE_LABELS[viewingMode]}</Badge>;
      }
    },
    {
      accessorKey: "screenFormat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Format ekranu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const screenFormat = row.original.screenFormat;
        return <Badge>{SCREEN_FORMAT_LABELS[screenFormat]}</Badge>;
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
                  <Link href={`/panel-pracownika/pulpit/seanse/${showtimeId}`}>
                    Wyświetl szczegóły
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/panel-pracownika/pulpit/seanse/${showtimeId}/edytuj`}
                  >
                    Edytuj
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleMarkShowtimeAsOngoing(showtimeId)}
                >
                  Oznacz jako trwający
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleMarkShowtimeAsFinished(showtimeId)}
                >
                  Oznacz jako zakończony
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
  data: ShowtimeData[];
}

export default function ShowtimesTable({ data }: ShowtimesTableProps) {
  const router = useRouter();

  async function handleDeleteShowtime(showtimeId: string) {
    const result = await deleteShowtime(showtimeId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Seans został usunięty.");
      router.refresh();
    } else {
      toast.error("Wystąpił błąd podczas usuwania seansu.");
    }
  }

  async function handleMarkShowtimeAsOngoing(showtimeId: string) {
    const result = await markShowtimeAsOngoing(showtimeId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Seans został oznaczony jako trwający.");
      router.refresh();
    } else {
      toast.error("Wystąpił błąd podczas oznaczania seansu jako trwającego.");
    }
  }

  async function handleMarkShowtimeAsFinished(showtimeId: string) {
    const result = await markShowtimeAsFinished(showtimeId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Seans został oznaczony jako zakończony.");
      router.refresh();
    } else {
      toast.error("Wystąpił błąd podczas oznaczania seansu jako zakończonego.");
    }
  }

  const columns = createColumns(
    handleDeleteShowtime,
    handleMarkShowtimeAsOngoing,
    handleMarkShowtimeAsFinished
  );

  return <DataTable columns={columns} data={data} />;
}
