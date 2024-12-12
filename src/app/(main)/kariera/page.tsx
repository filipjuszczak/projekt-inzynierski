import { Button } from "@/components/ui/button";
import Benefits from "@/components/careers/Benefits";
import CompanyCulture from "@/components/careers/CompanyCulture";
import JobListings from "@/components/careers/JobListings";

export default function CareersPage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Kariera w CinemaPlus
        </h1>
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Dołącz do nas</h2>
          <p className="mb-4 text-lg text-muted-foreground">
            W CinemaPlus z pasją tworzymy niezapomniane wrażenia dla miłośników
            kina. Zawsze szukamy utalentowanych osób, które podzielają nasz
            entuzjazm dla filmu i obsługi klienta, aby dołączyły do naszego
            rozwijającego się zespołu.
          </p>
          <p className="mb-4 text-lg text-muted-foreground">
            Niezależnie od tego, czy jesteś doświadczonym profesjonalistą, czy
            dopiero zaczynasz swoją karierę, oferujemy ekscytujące możliwości
            rozwoju i wprowadzania zmian w świecie kina.
          </p>
        </section>
        <JobListings />
        <Benefits />
        <CompanyCulture />
        <section className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold">Gotowy?</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Jeśli jesteś zainteresowany możliwością pracy z nami, wyślij swoje
            podanie!
          </p>
          <Button size="lg">Złóż podanie</Button>
        </section>
      </div>
    </main>
  );
}
