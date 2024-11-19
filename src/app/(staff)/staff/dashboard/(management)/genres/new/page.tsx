import GenreForm from "@/components/dashboard/genres/GenreForm";

export default function NewGenrePage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-center text-3xl font-bold">Utwórz nowy gatunek</h1>
      <GenreForm />
    </div>
  );
}
