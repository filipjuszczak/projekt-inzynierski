"use client";

import { useFetchGenres } from "@/app/(staff)/staff/dashboard/genres/queries";
import Link from "next/link";

export default function GenreList() {
  const { data, isPending } = useFetchGenres();

  return (
    <div>
      {isPending && <p>Loading...</p>}
      {data && data.length === 0 && <p>No genres found...</p>}
      {data && (
        <ul>
          {data.map((genre) => (
            <li key={genre.id}>
              <Link href={`/staff/dashboard/genres/${genre.id}/edit`}>
                {genre.name} - {genre.ageRestriction}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
