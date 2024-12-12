import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  { id: "acceptance", title: "Akceptacja warunków" },
  { id: "services", title: "Opis usług" },
  { id: "conduct", title: "Postępowanie użytkowników" },
  { id: "tickets", title: "Zakupy i zwroty biletów" },
  { id: "privacy", title: "Polityka prywatności" },
  { id: "liability", title: "Ograniczenie odpowiedzialności" },
  { id: "changes", title: "Zmiany warunków" },
  { id: "contact", title: "Kontakt" }
];

export default function TableOfContents() {
  return (
    <Card className="sticky top-16 max-h-fit">
      <CardHeader>
        <CardTitle>Spis treści</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link href={`#${section.id}`} className="hover:underline">
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
