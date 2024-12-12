import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Map from "@/components/contact/Map";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-24">
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
