import TableOfContents from "@/components/terms-of-service/TableOfContents";
import TermsContent from "@/components/terms-of-service/TermsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warunki korzystania z usług",
  description:
    "Przeczytaj warunki korzystania z usług Sunema, aby dowiedzieć się, jakie zasady obowiązują na naszej platformie.",
  openGraph: {
    title: "Warunki korzystania z usług | Sunema",
    description:
      "Przeczytaj warunki korzystania z usług Sunema, aby dowiedzieć się, jakie zasady obowiązują na naszej platformie."
  }
};

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Warunki korzystania z usług Sunema
      </h1>
      <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
        <TableOfContents />
        <TermsContent />
      </div>
    </main>
  );
}
