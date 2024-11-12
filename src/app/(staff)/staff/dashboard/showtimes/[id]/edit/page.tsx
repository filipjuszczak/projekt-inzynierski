"use client";

import { useParams } from "next/navigation";
import ShowtimeForm from "@/app/(staff)/staff/dashboard/showtimes/ShowtimeForm";

export default function EditShowtimePage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl">Edit Showtime Page</h1>
        <ShowtimeForm showtimeId={params.id} />
      </div>
    </main>
  );
}
