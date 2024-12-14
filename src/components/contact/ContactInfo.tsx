import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactInfo() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Kontakt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
