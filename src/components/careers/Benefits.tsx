import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Konkurencyjne wynagrodzenie i premie za wyniki",
  "Ubezpieczenie zdrowotne i dentystyczne",
  "Płatny czas wolny i zwolnienie chorobowe",
  "Darmowe bilety do kina i zniżki",
  "Możliwości rozwoju zawodowego"
];

export default function Benefits() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold">Korzyści dla pracownika</h2>
      <Card>
        <CardHeader>
          <CardTitle>Oferujemy:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-4 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
