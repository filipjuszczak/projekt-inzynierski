import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Map from "@/components/contact/Map";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z nami, jeśli masz pytania lub wątpliwości.",
  openGraph: {
    title: "Kontakt | Sunema",
    description: "Skontaktuj się z nami, jeśli masz pytania lub wątpliwości."
  }
};

export default function ContactPage() {
  return (
    <main className="container mx-auto flex-1 px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Skontaktuj się z nami
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
            <Map />
          </div>
        </div>
      </div>
    </main>
  );
}
