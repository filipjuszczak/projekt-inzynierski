"use client";

import Link from "next/link";
import { CircleAlert, Loader2, MoreHorizontal } from "lucide-react";
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
import { useFetchGenres } from "@/app/(staff)/staff/dashboard/genres/queries";
import type { GenreWithMovieCount } from "@/lib/types";

export default function GenreList() {
  const { data: genresData, isPending } = useFetchGenres();

  return (
    <div>
      {isPending && <Loader />}
      {genresData && genresData.length === 0 && <NotFound />}
      {genresData && <GenreTable genres={genresData} />}
    </div>
  );
}

function Loader() {
  return (
    <div>
      <Loader2 className="size-4 animate-spin" />
      Loading...
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <CircleAlert className="size-4 animate-spin" />
      No gernes found...
    </div>
  );
}

interface GenreTableProps {
  genres: GenreWithMovieCount[];
}

const ageRestrictionLabels = {
  0: "Brak",
  12: "12+",
  15: "15+",
  18: "18+"
};

function GenreTable({ genres }: GenreTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age Restriction</TableHead>
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
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/staff/dashboard/genres/${genre.id}/edit`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
