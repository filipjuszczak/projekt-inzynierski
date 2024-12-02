import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import ShowtimeFilters from "@/components/showtimes/ShowtimeFilters";
import ShowtimeFiltersSkeleton from "@/components/showtimes/skeletons/ShowtimeFiltersSkeleton";
import { getShowtimes } from "@/app/(main)/repertuar/data";
import { AGE_RESTRICTION_LABELS } from "@/lib/constants";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

interface ShowtimesPage {
  searchParams: Promise<{
    date?: string;
    viewingMode?: ViewingMode;
    screenFormat?: ScreenFormat;
  }>;
}

export default async function ShowtimesPage({ searchParams }: ShowtimesPage) {
  const filters = await searchParams;
  const showtimes = await getShowtimes(filters);

  return (
    <div className="container mx-auto flex-grow px-4 py-24">
      <h1 className="mb-6 text-3xl font-bold">Repertuar</h1>
      <Suspense fallback={<ShowtimeFiltersSkeleton />}>
        <ShowtimeFilters />
      </Suspense>
      <div className="grid gap-6">
        {Object.entries(showtimes).map(([key, value]) => (
          <MovieCard key={key} {...value} />
        ))}
      </div>
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
          <div className="flex gap-4 *:w-full">
            <div className="relative aspect-[2/3] max-h-[400px] w-full max-w-[250px]">
              <Image
                src={posterUrl || "/images/image-placeholder.svg"}
                alt={`Plakat filmu ${title}`}
                fill
                className="aspect-[2/3] rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">
                <Link href={`/filmy/${encodeURIComponent(title)}`}>
                  {title}
                </Link>
              </h2>
              <div className="mb-4 flex items-center gap-2">
                {genres.map((genre) => (
                  <Badge key={genre.id}>{genre.name}</Badge>
                ))}
                <Badge variant="outline">
                  Ograniczenie wiekowe:{" "}
                  {
                    AGE_RESTRICTION_LABELS[
                      highestAgeRestriction as keyof typeof AGE_RESTRICTION_LABELS
                    ]
                  }
                </Badge>
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {showtimes.map((showtime, index) => (
                    <Link
                      key={index}
                      href={`/seans/${showtime.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm"
                      })}
                    >
                      {format(showtime.startTime, "HH:mm")}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
