import GenreForm from "@/app/(staff)/staff/dashboard/genres/GenreForm";

export default function NewGenrePage() {
  return (
    <div className="flex items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-2xl">Utwórz nowy gatunek filmowy</h1>
        <GenreForm />
      </div>
    </div>
  );
}
