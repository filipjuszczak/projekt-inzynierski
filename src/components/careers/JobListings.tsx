import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const jobs = [
  { title: "Menadżer kina", department: "Zarządzanie", type: "Pełny etat" },
  {
    title: "Operator projektora",
    department: "Dział techniczny",
    type: "Pełny etat"
  },
  {
    title: "Kasjer",
    department: "Obsługa klienta",
    type: "Pół etatu"
  },
  {
    title: "Koordynator marketingu",
    department: "Marketing",
    type: "Pełny etat"
  }
];

export default function JobListings() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold">Aktualne oferty pracy</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="secondary">{job.department}</Badge>
                <Badge>{job.type}</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Zobacz szczegóły
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
