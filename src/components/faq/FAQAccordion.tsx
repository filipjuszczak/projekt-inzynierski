import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Jakie są Wasze godziny otwarcia?",
    answer:
      "Nasze kino jest otwarte codziennie od 08:00 do 00:00. Kasa jest otwierana 30 minut przed pierwszym seansem i zamykana 30 minut po rozpoczęciu ostatniego seansu."
  },
  {
    question: "Jak mogę zakupić bilety?",
    answer:
      "Bilety można kupić online za pośrednictwem naszej strony internetowej, aplikacji mobilnej lub osobiście w kasie. Zalecamy zakup biletów z wyprzedzeniem na popularne pokazy, aby zapewnić ich dostępność."
  },
  {
    question: "Czy oferujecie zniżki dla studentów, seniorów lub dzieci?",
    answer:
      "Tak, oferujemy zniżki dla studentów (z ważną legitymacją), seniorów (65+) i dzieci (poniżej 12 lat). Zniżki te są dostępne na wszystkie regularne seanse, z wyjątkiem wydarzeń specjalnych lub premier."
  },
  {
    question: "Jaka jest polityka zwrotów?",
    answer:
      "Rezerwacje mogą zostać odwołane do 2 godzin przed planowaną godziną seansu. Po upływie tego czasu zwroty są dokonywane wyłącznie w przypadku trudności technicznych lub odwołania przez nas seansu."
  },
  {
    question: "Czy własne jedzenie i napoje są dozwolone?",
    answer:
      "Uprzejmie prosimy o niewnoszenie do kina własnego jedzenia i napojów. Oferujemy szeroki wybór przekąsek i napojów w naszym barze, aby poprawić wrażenia z oglądania filmów."
  },
  {
    question:
      "Czy dostępne są miejsca siedzące dla osób z niepełnosprawnościami?",
    answer:
      "Tak, we wszystkich naszych salach mamy wyznaczone miejsca dla wózków inwalidzkich i osób towarzyszących. Skontaktuj się z naszym działem obsługi klienta przed rozpoczęciem seansu."
  },
  {
    question:
      "Jak mogę dowiedzieć się o nadchodzących filmach i wydarzeniach specjalnych?",
    answer:
      "Zalecamy zapisanie się do naszego newslettera lub śledzenie nas w mediach społecznościowych, aby uzyskać najbardziej aktualne informacje."
  }
];

export default function FAQAccordion() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Najczęstsze pytania</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
