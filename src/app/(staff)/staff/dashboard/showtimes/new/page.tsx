import ShowtimeForm from "@/app/(staff)/staff/dashboard/showtimes/ShowtimeForm";

export default function CreateShowtimePage() {
  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl">Create New Showtime</h1>
        <ShowtimeForm />
      </div>
    </main>
  );
}
