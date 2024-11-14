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
import { useFetchGenres } from "@/app/(staff)/staff/dashboard/(main)/genres/queries";
import type { GenreWithMovieCount } from "@/lib/types";

export default function GenreList() {
  const { data: genresData, isPending } = useFetchGenres();

  return (
    <div>
      {isPending && <Loader />}
      {genresData && genresData.length === 0 && <NotFound />}
      {genresData && genresData.length > 0 && (
        <GenreTable genres={genresData} />
      )}
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
          <TableHead>Nazwa</TableHead>
          <TableHead>Ograniczenie wiekowe</TableHead>
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
                    <span className="sr-only">Otwórz menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/staff/dashboard/genres/${genre.id}/edit`}>
                    <DropdownMenuItem>Edytuj</DropdownMenuItem>
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
