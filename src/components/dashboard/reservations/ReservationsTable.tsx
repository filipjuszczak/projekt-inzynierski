"use client";

import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowUpDown, HandCoins, MoreVertical, User } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import {
  deleteReservation,
  setReservationAsPaid
} from "@/app/(staff)/panel-pracownika/pulpit/(management)/rezerwacje/actions";
import { RESERVATION_LABELS } from "@/lib/constants";
import type { ColumnDef } from "@tanstack/react-table";
import type { Reservation } from "@/lib/types";

type Columns = ColumnDef<Reservation>[];

function createColumns(
  handleSetAsPaid: (orderId: string) => void,
  handleDeleteReservation: (orderId: string) => void
): Columns {
  return [
    {
      accessorKey: "id",
      header: "ID"
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rodzaj
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const type = row.original.type;

        return <span>{RESERVATION_LABELS[type]}</span>;
      }
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <HandCoins />
            Opłacone?
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isPaid = row.original.isPaid;

        return <span>{isPaid ? "Tak" : "Nie"}</span>;
      }
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <User />
            Użytkownik
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original.user;

        return (
          <span>
            {user ? (
              <>
                {user.firstName} {user.lastName}
              </>
            ) : (
              "Użytkownik nie istnieje."
            )}
          </span>
        );
      }
    },
    {
      accessorKey: "showtime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Film
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const movie = row.original.showtime.movie;
        return <span>{movie.title}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const reservation = row.original;

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
                    <Button
                      variant="ghost"
                      onClick={() => handleSetAsPaid(reservation.id)}
                    >
                      Oznacz jako opłacone
                    </Button>
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
                  <DialogTitle>Rezerwacja</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID rezerwacji</span>
                    : {reservation.id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rodzaj:</span>{" "}
                    {RESERVATION_LABELS[reservation.type]}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Opłacona:</span>{" "}
                    {reservation.isPaid ? "Tak" : "Nie"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Użytkownik:</span>{" "}
                    {reservation.user
                      ? `${reservation.user.firstName} ${reservation.user.lastName}`
                      : "Użytkownik nie istnieje."}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Film:</span>{" "}
                    {reservation.showtime.movie.title}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sala:</span>{" "}
                    {reservation.showtime.room.number}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Miejsca:</span>{" "}
                    <ul className="list-inside list-disc space-y-2">
                      {reservation.showtime.seats.map((seat) => (
                        <li key={`${seat.rowNumber}-${seat.seatNumber}`}>
                          <span className="text-muted-foreground">Rząd:</span>{" "}
                          {seat.rowNumber};{" "}
                          <span className="text-muted-foreground">Numer:</span>{" "}
                          {seat.seatNumber}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Data utworzenia:
                    </span>{" "}
                    {format(reservation.createdAt, "dd.MM.yyyy HH:mm")}
                  </div>
                </div>
              </DialogContent>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Czy na pewno chcesz usunąć rezerwację?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta operacja jest nieodwracalna.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteReservation(reservation.id)}
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

interface ReservationsTableProps {
  data: Reservation[];
}

export default function ReservationsTable({ data }: ReservationsTableProps) {
  async function handleDeleteReservation(orderId: string) {
    const result = await deleteReservation(orderId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Rezerwacja została usunięta.");
    } else {
      toast.error("Wystąpił błąd podczas usuwania rezerwacji.");
    }
  }

  async function handleSetAsPaid(orderId: string) {
    const result = await setReservationAsPaid(orderId);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      toast.success("Rezerwacja została zaktualizowana jako opłacona.");
    } else {
      toast.error("Wystąpił błąd podczas aktualizacji rezerwacji.");
    }
  }

  const columns = createColumns(handleSetAsPaid, handleDeleteReservation);

  return <DataTable columns={columns} data={data} />;
}
