import GenreForm from "@/components/dashboard/genres/GenreForm";

export default function NewGenrePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-center text-3xl font-bold">
          Utwórz nowy gatunek filmowy
        </h1>
        <GenreForm />
      </div>
    </div>
  );
}
