import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShowtimesToday } from "@/app/(staff)/staff/dashboard/(overview)/db";

export default async function ShowtimesToday() {
  const movies = await getShowtimesToday();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Dzisiejsze seanse - {format(new Date(), "dd.MM.yyyy")}
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
                  <Link href={`/staff/dashboard/movies/${movie.id}`}>
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
                      <Link href={`/staff/dashboard/showtimes/${showtime.id}`}>
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
