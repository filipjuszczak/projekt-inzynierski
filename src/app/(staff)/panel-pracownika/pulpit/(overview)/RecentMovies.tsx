import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentlyAddedMovies } from "@/app/(staff)/panel-pracownika/pulpit/(overview)/data";
import { Badge } from "@/components/ui/badge";

export default async function RecentMovies() {
  const recentMovies = await getRecentlyAddedMovies();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnio dodane filmy</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMovies.length ? (
          <div className="space-y-8 md:space-y-4">
            {recentMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col gap-8 border-b pb-2 md:flex-row md:items-center md:justify-between md:gap-0"
              >
                <div className="space-y-2">
                  <div className="max-w-[20ch] truncate font-semibold md:max-w-none">
                    <Link href={`/panel-pracownika/pulpit/filmy/${movie.id}`}>
                      {movie.title}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id}>{genre.name}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Dodano {format(movie.createdAt, "dd.MM.yyyy")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Brak filmów.</div>
        )}
      </CardContent>
    </Card>
  );
}
