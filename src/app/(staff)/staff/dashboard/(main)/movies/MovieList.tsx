"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { CalendarDays, Clock, MoreVertical, Search, Star } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useFetchMovies } from "@/app/(staff)/staff/dashboard/(main)/movies/queries";
import type { MovieWithGenres } from "@/lib/types";
import { SmartDatetimeInput } from "@/components/ui/smart-date-time-picker";

export default function MovieList() {
  const { data: moviesData, isFetching } = useFetchMovies();

  return (
    <div>
      {isFetching && <Loader />}
      {moviesData && moviesData.length === 0 && <NotFound />}
      {moviesData && moviesData.length > 0 && (
        <MovieTable movies={moviesData} />
      )}
    </div>
  );
}

interface MovieTableProps {
  movies: MovieWithGenres[];
}

function MovieTable({ movies }: MovieTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const debouncedHandleTitleChange = useDebouncedCallback((title: string) => {
    const query = createQueryString("title", title);
    router.push(pathname + "?" + query);
  }, 500);

  // create a function that will change search params whenever dateFrom and dateTo change
  useEffect(() => {
    if (dateFrom) {
      const query = createQueryString("dateFrom", dateFrom.toISOString());
      router.push(pathname + "?" + query);
    }
  }, [dateFrom, createQueryString, pathname, router]);

  useEffect(() => {
    debouncedHandleTitleChange(title);
  }, [title, debouncedHandleTitleChange, searchParams]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(title.toLowerCase().trim())
    );
  }, [title, movies]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj filmu po tytule..."
            className="w-full pl-8 md:w-[300px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div>
            <span className="text-sm">Data od:</span>
            <SmartDatetimeInput
              value={dateFrom}
              onValueChange={(date) => setDateFrom(date)}
              placeholder="Wybierz datę..."
            />
          </div>
          <div>
            <span className="text-sm">Data do:</span>
            <SmartDatetimeInput
              value={dateTo}
              onValueChange={(date) => setDateTo(date)}
              placeholder="Wybierz datę..."
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tytuł</TableHead>
            <TableHead>Gatunki</TableHead>
            <TableHead>Długość</TableHead>
            <TableHead>Ocena</TableHead>
            <TableHead>Rok wydania</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell className="font-medium">{movie.title}</TableCell>
              <TableCell className="space-x-1">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {movie.duration} min
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-400" />
                  Rating here
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  {movie.releaseYear}
                </div>
              </TableCell>
              <TableCell className="text-right">
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
                      <Link href={`/staff/dashboard/movies/${movie.id}`}>
                        Wyświetl szczegóły
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/staff/dashboard/movies/${movie.id}/edit`}>
                        Edytuj
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
