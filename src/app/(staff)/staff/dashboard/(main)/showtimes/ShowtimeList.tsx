"use client";

import Link from "next/link";
import { format } from "date-fns";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useFetchShowtimes } from "@/app/(staff)/staff/dashboard/(main)/showtimes/queries";

export default function ShowtimeList() {
  const { data: showtimesData, isPending } = useFetchShowtimes();

  return (
    <div>
      {isPending && <Loader />}
      {showtimesData && showtimesData.length === 0 && <NotFound />}
      {showtimesData && showtimesData.length > 0 && (
        <ul>
          {showtimesData.map((showtime) => (
            <li key={showtime.id}>
              <Link href={`/staff/dashboard/showtimes/${showtime.id}/edit`}>
                <div>
                  Showtime in room {showtime.room.number} starts on{" "}
                  {format(new Date(showtime.startTime), "dd/MM/yyyy HH:mm")} and
                  ends on{" "}
                  {format(new Date(showtime.endTime), "dd/MM/yyyy HH:mm")}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
