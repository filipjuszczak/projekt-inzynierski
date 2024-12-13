import { Button } from "@/components/ui/button";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import Link from "next/link";

interface HeroProps {
  featuredMovie: {
    title: string;
    posterUrl: string | null;
    shortDescription: string;
  } | null;
}

export default async function Hero({ featuredMovie }: HeroProps) {
  return (
    <section className="w-full py-12 text-foreground md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="relative aspect-[2/3] w-full md:order-last">
            <ImageWithLoader
              src={featuredMovie?.posterUrl || "/images/image-placeholder.svg"}
              fill
              priority
              alt={
                featuredMovie?.title
                  ? `Plakat filmu ${featuredMovie?.title}`
                  : "Obraz zastępczy"
              }
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              border
              rounded
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Teraz w kinie: {featuredMovie?.title || "Brak danych."}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {featuredMovie?.shortDescription || "Brak danych."}
              </p>
            </div>
            {featuredMovie?.title && (
              <Button size="lg" asChild>
                <Link
                  href={`/filmy/${encodeURIComponent(featuredMovie?.title || "")}`}
                  className="max-w-fit"
                >
                  Zobacz szczegóły
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
