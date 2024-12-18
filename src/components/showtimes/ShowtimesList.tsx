import Link from "next/link";
import { toZonedTime, format } from "date-fns-tz";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { getShowtimes } from "@/app/(main)/repertuar/data";
import { AGE_RESTRICTION_LABELS, TIME_ZONE } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface ShowtimesListProps {
  filters: {
    date?: string;
    title?: string;
    genre?: string;
    viewingMode?: ViewingMode;
    screenFormat?: ScreenFormat;
  };
}

export default async function ShowtimesList({ filters }: ShowtimesListProps) {
  const showtimes = await getShowtimes(filters);
  const showtimesByMovies = Object.entries(showtimes);

  if (showtimesByMovies.length === 0) {
    return (
      <div className="text-center">
        Brak wyników wyszukiwania dla podanych kryteriów.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showtimesByMovies.map(([key, value]) => (
        <MovieCard key={key} {...value} />
      ))}
    </div>
  );
}

interface MovieCardProps {
  title: string;
  posterUrl: string | null;
  genres: { id: string; name: string; ageRestriction: number }[];
  showtimes: { id: string; startTime: Date }[];
}

function MovieCard({ title, posterUrl, genres, showtimes }: MovieCardProps) {
  const highestAgeRestriction = Math.max(
    ...genres.map((genre) => genre.ageRestriction)
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 *:w-full min-[640px]:flex-row">
            <div className="relative mx-auto flex aspect-[2/3] max-h-[400px] w-full max-w-[250px]">
              <ImageWithLoader
                src={posterUrl || "/images/image-placeholder.svg"}
                fill
                priority
                alt={`Plakat filmu ${title}`}
                className="aspect-[2/3] rounded-lg object-cover"
                sizes="(max-width: 450px) 100vw, (min-width: 450px) 60vw, (min-width: 640px) 100vw, (min-width: 768px) 50vw, (min-width: 1024px) 40vw, (min-width: 1280px) 50vw, (min-width: 1536px) 40vw"
              />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">
                <Link href={`/filmy/${encodeURIComponent(title)}`}>
                  {title}
                </Link>
              </h2>
              <div className="mb-2 flex items-center gap-2">
                {genres.map((genre) => (
                  <Badge key={genre.id}>{genre.name}</Badge>
                ))}
              </div>
              <Badge variant="outline" className="mb-8">
                Ograniczenie wiekowe:{" "}
                {
                  AGE_RESTRICTION_LABELS[
                    highestAgeRestriction as keyof typeof AGE_RESTRICTION_LABELS
                  ]
                }
              </Badge>
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {showtimes.map((showtime, index) => {
                    const zonedDate = toZonedTime(
                      showtime.startTime,
                      TIME_ZONE
                    );
                    const formattedDate = format(zonedDate, "HH:mm", {
                      timeZone: TIME_ZONE
                    });

                    return (
                      <Link
                        key={index}
                        href={`/seans/${showtime.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm"
                        })}
                      >
                        {formattedDate}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
