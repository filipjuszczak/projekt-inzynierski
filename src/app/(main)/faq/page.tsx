import ContactSection from "@/components/faq/ContactSection";
import FAQAccordion from "@/components/faq/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Najczęściej zadawane pytania",
  description:
    "Odpowiedzi na najczęściej zadawane pytania dotyczące naszego kina.",
  openGraph: {
    title: "Najczęściej zadawane pytania | Sunema",
    description:
      "Odpowiedzi na najczęściej zadawane pytania dotyczące naszego kina."
  }
};

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Najczęściej zadawane pytania
        </h1>
        <div className="space-y-24">
          <section>
            <p className="mx-auto mb-4 max-w-prose text-lg text-muted-foreground">
              Tutaj znajdziesz odpowiedzi na najczęściej zadawane pytania
              dotyczące Starlight Cinema. Jeśli nie możesz znaleźć informacji
              których szukasz, skontaktuj się z nami.
            </p>
          </section>
          <FAQAccordion />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
