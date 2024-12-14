import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyCulture() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold">Kultura w naszym kinie</h2>
      <Card>
        <CardHeader>
          <CardTitle>Życie w Sunema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 text-muted-foreground md:grid-cols-2">
            <div>
              <p className="mb-4 text-lg">
                W Starlight Cinema wierzymy w promowanie pozytywnego,
                integracyjnego i opartego na współpracy środowiska pracy. Nasz
                zespół łączy wspólna pasja do filmu i zaangażowanie w
                dostarczanie wyjątkowych wrażeń naszym klientom.
              </p>
              <p className="mb-4 text-lg">
                Cenimy kreatywność, innowacyjność i rozwój osobisty. Niezależnie
                od tego, czy pracujesz za kulisami, czy bezpośrednio z naszymi
                klientami, będziesz istotną częścią ożywiania magii kina.
              </p>
            </div>
            <div className="relative h-64 md:h-full">
              <Image
                src="/images/image-placeholder.svg"
                alt="Zespół Sunema"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
