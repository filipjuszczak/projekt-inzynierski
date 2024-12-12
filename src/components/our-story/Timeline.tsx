import { Card, CardContent } from "@/components/ui/card";

const milestones = [
  {
    year: 1985,
    event: "CinemaPlus otwiera swoje drzwi z jednym ekranem"
  },
  {
    year: 1992,
    event:
      "Rozbudowa do trzech ekranów, wprowadzenie naszego pierwszego projektora cyfrowego"
  },
  {
    year: 2000,
    event: "Rozpoczęcie naszego corocznego Festiwalu Filmowego CinemaPlus"
  },
  { year: 2010, event: "Gruntowna renowacja, wprowadzenie IMAX" },
  {
    year: 2020,
    event:
      "Wprowadzenie wirtualnych pokazów i wydarzeń kinowych na świeżym powietrzu"
  }
];

export default function Timeline() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Nasza przygoda</h2>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-4">
              <div className="mr-4 text-2xl font-bold text-primary">
                {milestone.year}
              </div>
              <div className="text-lg">{milestone.event}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
