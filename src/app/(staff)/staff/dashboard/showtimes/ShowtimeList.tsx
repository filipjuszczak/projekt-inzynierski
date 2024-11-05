"use client";

import { useFetchShowtimes } from "@/app/(staff)/staff/dashboard/showtimes/queries";

export default function ShowtimeList() {
  const { data: showtimesData, isPending } = useFetchShowtimes();
  console.log(showtimesData);

  return (
    <div>
      {isPending && <p>Loading...</p>}
      {showtimesData && (
        <ul>
          {showtimesData.map((showtime) => (
            <li key={showtime.id}>Showtime</li>
          ))}
        </ul>
      )}
    </div>
  );
}
