import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function TermsContent() {
  return (
    <div className="space-y-8">
      <Card id="acceptance">
        <CardHeader>
          <CardTitle>1. Akceptacja warunków</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Uzyskując dostęp lub korzystając z usług Sunema, w tym naszej strony
            internetowej, aplikacji mobilnej i fizycznych lokalizacji,
            użytkownik wyraża zgodę na przestrzeganie niniejszych Warunków
            świadczenia usług. Jeśli nie zgadzasz się z tymi warunkami, nie
            korzystaj z naszych usług.
          </p>
        </CardContent>
      </Card>
      <Card id="services">
        <CardHeader>
          <CardTitle>2. Opis usług</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sunema świadczy usługi projekcji filmów, rezerwacji biletów online i
            powiązane usługi rozrywkowe. Zastrzegamy sobie prawo do modyfikacji,
            zawieszenia lub zaprzestania dowolnej części naszych usług w
            dowolnym momencie bez powiadomienia.
          </p>
        </CardContent>
      </Card>
      <Card id="conduct">
        <CardHeader>
          <CardTitle>3. Postępowanie Użytkowników</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Użytkownicy muszą przestrzegać wszystkich obowiązujących przepisów
            prawa i regulacji. Zabronione postępowanie obejmuje między innymi:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nagrywanie lub fotografowanie filmów</li>
            <li>Zakłócające zachowanie podczas seansów</li>
            <li>Nieautoryzowana odsprzedaż biletów</li>
            <li>Wnoszenie do kina własnego jedzenia i napojów</li>
          </ul>
        </CardContent>
      </Card>
      <Card id="tickets">
        <CardHeader>
          <CardTitle>4. Zakupy i zwroty biletów</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sprzedaż biletów jest ostateczna. Zwroty lub wymiany mogą być
            dokonywane według uznania kierownictwa Sunema w przypadku problemów
            technicznych lub odwołania seansu. Więcej informacji można znaleźć w
            naszej polityce.
          </p>
        </CardContent>
      </Card>
      <Card id="privacy">
        <CardHeader>
          <CardTitle>5. Polityka prywatności</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Korzystanie z naszych usług podlega również naszej Polityce
            prywatności. Prosimy o zapoznanie się z tą polityką, aby zrozumieć,
            w jaki sposób gromadzimy, wykorzystujemy i chronimy dane osobowe
            użytkowników.
          </p>
        </CardContent>
      </Card>
      <Card id="liability">
        <CardHeader>
          <CardTitle>6. Ograniczenie odpowiedzialności</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sunema nie ponosi odpowiedzialności za jakiekolwiek pośrednie,
            przypadkowe, szczególne, wynikowe lub karne szkody wynikające z
            korzystania lub niemożności korzystania z naszych usług. Nasza
            odpowiedzialność jest ograniczona do kwoty zapłaconej za daną
            usługę.
          </p>
        </CardContent>
      </Card>
      <Card id="changes">
        <CardHeader>
          <CardTitle>7. Zmiana warunków</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Zastrzegamy sobie prawo do zmiany niniejszych Warunków świadczenia
            usług w dowolnym momencie. Zmiany wejdą w życie natychmiast po ich
            opublikowaniu na naszej stronie internetowej. Dalsze korzystanie z
            naszych usług po opublikowaniu zmian stanowi akceptację zmienionych
            warunków.
          </p>
        </CardContent>
      </Card>
      <Card id="contact">
        <CardHeader>
          <CardTitle>8. Kontakt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            W przypadku jakichkolwiek pytań dotyczących niniejszych Warunków
            świadczenia usług prosimy kontakt:
          </p>
          <div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>ul. Kinowa 2A, 00-000 Warszawa</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <a href="tel:123456789" className="hover:underline">
                +48 123 456 789
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <a href="mailto:info@sunema.com" className="hover:underline">
                info@sunema.com
              </a>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Godziny otwarcia: 08:00 - 00:00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
