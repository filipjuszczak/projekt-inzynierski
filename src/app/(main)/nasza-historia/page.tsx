import Timeline from "@/components/our-story/Timeline";
import OurMission from "@/components/our-story/OurMission";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasza historia",
  description: "Dowiedz się więcej o naszej historii i misji.",
  openGraph: {
    title: "Nasza historia | Sunema",
    description: "Dowiedz się więcej o naszej historii i misji."
  }
};

export default function OurStoryPage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="mb-24 text-center text-4xl font-bold">Nasza historia</h1>
      <div className="mx-auto max-w-3xl space-y-24">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Narodziny Sunema</h2>
          <p className="max-w-prose text-pretty text-lg text-muted-foreground">
            Założone w 1985 roku Sunema rozpoczęło działalność jako małe,
            jednosalowe kino z wielkim marzeniem: przynieść magię filmów naszej
            lokalnej społeczności. To, co zaczęło się jako projekt pasji
            entuzjastów filmowych Janusza i Grażyny Kowalskich, stało się
            ukochaną instytucją kulturalną.
          </p>
          <p className="max-w-prose text-pretty text-lg text-muted-foreground">
            Przez lata rozwijaliśmy się, wprowadzaliśmy innowacje i
            dostosowywaliśmy, ale nasza podstawowa misja pozostaje taka sama:
            zapewnić niezrównane kinowe doświadczenie, które przenosi naszą
            publiczność do świata opowiadania historii.
          </p>
        </section>
        <Timeline />
        <OurMission />
      </div>
    </main>
  );
}
