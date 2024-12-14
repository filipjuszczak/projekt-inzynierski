import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OurMission() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Nasza misja</h2>
      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="text-lg text-muted-foreground">
            W Sunema naszą misją jest tworzenie wciągających i niezapomnianych
            wrażeń podczas oglądania filmów.
          </p>
          <div className="text-lg font-bold">Dążymy do:</div>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Prezentacji różnorodnych filmów z całego świata</li>
            <li>
              Wprowadzania najnowocześniejszej technologii zapewniającej
              najlepsze wrażenia audiowizualne
            </li>
            <li>
              Szerzenia miłości do kina w naszej społeczności poprzez edukację i
              wydarzenia specjalne
            </li>
            <li>
              Stworzenia przyjaznego i integracyjnego środowiska dla wszystkich
              entuzjastów kina
            </li>
            <li>Wspierania i promowania lokalnych filmowców i artystów</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
