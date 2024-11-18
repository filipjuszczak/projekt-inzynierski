"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { deleteGenre } from "@/app/(staff)/staff/dashboard/(management)/genres/actions";
import type { GenreWithMovieCount } from "@/lib/types";

const ageRestrictionLabels = {
  0: "Brak",
  12: "12+",
  15: "15+",
  18: "18+"
};

interface GenreTableProps {
  genres: GenreWithMovieCount[];
}

export default function GenreTable({ genres }: GenreTableProps) {
  const queryClient = useQueryClient();

  async function handleDeleteGenre(genreId: string) {
    const result = await deleteGenre(genreId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      await queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Gatunek został usunięty.");
    } else {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Ograniczenie wiekowe</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {genres.map((genre) => (
          <TableRow key={genre.id}>
            <TableCell>{genre.name}</TableCell>
            <TableCell>
              {
                ageRestrictionLabels[
                  genre.ageRestriction as keyof typeof ageRestrictionLabels
                ]
              }
            </TableCell>
            <TableCell className="text-right">
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
                        <Link href={`/staff/dashboard/genres/${genre.id}/edit`}>
                          Edytuj
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem>
                          <span className="text-destructive">Usuń</span>
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
                            ageRestrictionLabels[
                              genre.ageRestriction as keyof typeof ageRestrictionLabels
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
