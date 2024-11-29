import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { getShowtimesByMovieTitle } from "@/app/(main)/filmy/data";
import { buttonVariants } from "@/components/ui/button";

interface UpcomingShowtimesForMovieProps {
  title: string;
}

export default async function UpcomingShowtimesForMovie({
  title
}: UpcomingShowtimesForMovieProps) {
  const upcomingShowtimes = await getShowtimesByMovieTitle(title);

  return (
    <div className="space-y-12">
      <h2 className="max-w-fit text-2xl font-bold">Nadchodzące seanse</h2>
      {Object.keys(upcomingShowtimes).length === 0 ? (
        <div>Brak nadchodzących seansów...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(upcomingShowtimes).map(([date, showtimes]) => (
            <div key={date} className="space-y-4">
              <h3 className="max-w-fit text-xl font-bold">
                {isToday(date)
                  ? "Dzisiaj"
                  : isTomorrow(date)
                    ? "Jutro"
                    : format(date, "dd.MM.yyyy")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {showtimes.map((showtime) => (
                  <UpcomingShowtime
                    key={showtime.id}
                    id={showtime.id}
                    startTime={showtime.startTime}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface UpcomingShowtimeProps {
  id: string;
  startTime: Date;
}

function UpcomingShowtime({ id, startTime }: UpcomingShowtimeProps) {
  return (
    <Link
      key={id}
      href={`/repertuar/${id}`}
      className={buttonVariants({ variant: "default" })}
    >
      {format(startTime, "HH:mm")}
    </Link>
  );
}
