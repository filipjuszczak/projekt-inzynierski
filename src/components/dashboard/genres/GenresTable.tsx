"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpDown, Hash, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
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
import { deleteGenre } from "@/app/(staff)/panel-pracownika/pulpit/(management)/gatunki/actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { GenreWithMovieCount } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { AGE_RESTRICTION_LABELS } from "@/lib/constants";

function createColumns(
  handleDeleteGenre: (genreId: string) => void
): ColumnDef<GenreWithMovieCount>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nazwa gatunku
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.name;
        return <span className="block max-w-[12ch] truncate">{name}</span>;
      }
    },
    {
      accessorKey: "ageRestriction",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ograniczenie wiekowe
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const ageRestriction = row.original.ageRestriction;
        return AGE_RESTRICTION_LABELS[
          ageRestriction as keyof typeof AGE_RESTRICTION_LABELS
        ];
      }
    },
    {
      accessorKey: "_count.movies",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Hash />
            Liczba filmów
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const genre = row.original;

        return (
          <AlertDialog>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Otwórz menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <span>Wyświetl szczegóły</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/panel-pracownika/pulpit/genre/${genre.id}/edytuj`}
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{genre.name}</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">
                  <div>
                    Ograniczenie wiekowe:{" "}
                    <span className="text-foreground">
                      {
                        AGE_RESTRICTION_LABELS[
                          genre.ageRestriction as keyof typeof AGE_RESTRICTION_LABELS
                        ]
                      }
                    </span>
                  </div>
                  <div>
                    Liczba filmów:{" "}
                    <span className="text-foreground">
                      {genre._count.movies}
                    </span>
                  </div>
                </div>
              </DialogContent>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Czy na pewno chcesz usunąć gatunek?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta operacja jest nieodwracalna.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteGenre(genre.id)}
                    className="bg-red-600 text-white hover:bg-red-800"
                  >
                    Usuń
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </Dialog>
          </AlertDialog>
        );
      }
    }
  ];
}

interface GenresTableProps {
  data: GenreWithMovieCount[];
}

export default function GenresTable({ data }: GenresTableProps) {
  const router = useRouter();

  async function handleDeleteGenre(genreId: string) {
    const result = await deleteGenre(genreId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Gatunek został usunięty.");
      router.refresh();
    } else {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  const columns = createColumns(handleDeleteGenre);

  return <DataTable columns={columns} data={data} />;
}
