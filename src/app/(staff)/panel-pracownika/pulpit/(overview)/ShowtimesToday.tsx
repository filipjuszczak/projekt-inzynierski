import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShowtimesToday } from "@/app/(staff)/panel-pracownika/pulpit/(overview)/data";

export default async function ShowtimesToday() {
  const movies = await getShowtimesToday();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Dzisiejsze seanse -{" "}
          {format(new Date(), "d MMMM yyyy", {
            locale: pl
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {movies.length === 0 ? (
          <div>Brak seansów.</div>
        ) : (
          <div className="space-y-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col items-start justify-between border-b pb-4 md:flex-row md:items-center"
              >
                <div className="font-semibold">
                  <Link href={`/panel-pracownika/pulpit/filmy/${movie.id}`}>
                    {movie.title}
                  </Link>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
                  {movie.showtimes.map((showtime) => (
                    <Button
                      key={showtime.id}
                      variant="default"
                      size="sm"
                      asChild
                    >
                      <Link
                        href={`/panel-pracownika/pulpit/seanse/${showtime.id}`}
                      >
                        {format(showtime.startTime, "HH:mm")}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
