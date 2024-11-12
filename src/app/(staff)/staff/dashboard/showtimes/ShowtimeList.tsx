"use client";

import { useFetchShowtimes } from "@/app/(staff)/staff/dashboard/showtimes/queries";
import { format } from "date-fns";
import Link from "next/link";

export default function ShowtimeList() {
  const { data: showtimesData, isPending } = useFetchShowtimes();

  return (
    <div>
      {isPending && <p>Loading...</p>}
      {showtimesData && showtimesData.length === 0 && (
        <p>No showtimes found...</p>
      )}
      {showtimesData && (
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
