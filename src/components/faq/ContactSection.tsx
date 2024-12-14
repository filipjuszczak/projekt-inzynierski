import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Masz jakieś pytania?</h2>
      <Card>
        <CardHeader>
          <CardTitle>Skontaktuj się z nami</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <a href="mailto:wsparcie@sunema.com" className="hover:underline">
              Email: wsparcie@sunema.com
            </a>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <a href="tel:123456789" className="hover:underline">
              Telefon: +48 123 456 789
            </a>
          </div>
          <p className="text-muted-foreground">
            Nasz zespół obsługi klienta jest dostępny codziennie od 9:00 do
            21:00, aby odpowiedzieć na wszelkie pytania.
          </p>
          <Button className="w-full sm:w-auto">Wyślij wiadomość</Button>
        </CardContent>
      </Card>
    </section>
  );
}
