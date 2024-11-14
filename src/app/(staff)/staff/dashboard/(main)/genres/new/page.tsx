import GenreForm from "@/app/(staff)/staff/dashboard/(main)/genres/GenreForm";

export default function NewGenrePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-2xl">Utwórz nowy gatunek filmowy</h1>
        <GenreForm />
      </div>
    </main>
  );
}
