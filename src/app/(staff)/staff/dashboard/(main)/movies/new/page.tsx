import MovieForm from "@/app/(staff)/staff/dashboard/(main)/movies/MovieForm";

export default function CreateMoviePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-2xl">Dodaj nowy film</h1>
        <MovieForm />
      </div>
    </main>
  );
}
