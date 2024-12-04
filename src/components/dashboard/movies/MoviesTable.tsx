"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowUpDown, Calendar, Clock, MoreVertical } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { deleteMovie } from "@/app/(staff)/panel-pracownika/pulpit/(management)/filmy/actions";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";
import type { ColumnDef } from "@tanstack/react-table";
import type { MovieData } from "@/lib/types";

type Columns = ColumnDef<MovieData>[];

function createColumns(handleDeleteMovie: (movieId: string) => void): Columns {
  return [
    {
      accessorKey: "title",
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
      },
      cell: ({ row }) => {
        const title = row.original.title;
        return (
          <span className="block max-w-[12ch] truncate md:max-w-none">
            {title}
          </span>
        );
      }
    },
    {
      accessorKey: "genres",
      header: "Gatunki",
      cell: ({ row }) => {
        const movie = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: "viewingModes",
      header: "Rodzaje audio",
      cell: ({ row }) => {
        const viewingModes = row.original.viewingModes;

        return (
          <div className="flex flex-wrap gap-2">
            {viewingModes.map((mode) => (
              <Badge key={`vm-${mode.id.toString()}`}>
                {VIEWING_MODE_LABELS[mode.viewingMode]}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: "screenFormats",
      header: "Formaty ekranu",
      cell: ({ row }) => {
        const screenFormats = row.original.screenFormats;

        return (
          <div className="flex flex-wrap gap-2">
            {screenFormats.map((format) => (
              <Badge key={`sf-${format.id.toString()}`}>
                {SCREEN_FORMAT_LABELS[format.screenFormat]}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Clock />
            Długość
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.duration} min</span>;
      }
    },
    {
      accessorKey: "releaseDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar />
            Data premiery
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const releaseDate = format(
          new Date(row.original.releaseDate),
          "dd.MM.yyyy"
        );

        return <span>{releaseDate}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const movieId = row.original.id;

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
                  <Link href={`/panel-pracownika/pulpit/filmy/${movieId}`}>
                    Wyświetl szczegóły
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/panel-pracownika/pulpit/filmy/${movieId}/edytuj`}
                  >
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
                  Czy na pewno chcesz usunąć film?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest nieodwracalna.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteMovie(movieId)}
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

interface MoviesTableProps {
  data: MovieData[];
}

export default function MoviesTable({ data }: MoviesTableProps) {
  const queryClient = useQueryClient();

  async function handleDeleteMovie(movieId: string) {
    const result = await deleteMovie(movieId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Film został usunięty.");
    } else {
      toast.error("Wystąpił błąd podczas usuwania filmu.");
    }
  }

  const columns = createColumns(handleDeleteMovie);

  return <DataTable columns={columns} data={data} />;
}
