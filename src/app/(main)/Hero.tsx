import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Hero() {
  return (
    <section className="w-full py-12 text-white md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <Image
            src="/images/image-placeholder.svg"
            width={1280}
            height={720}
            alt="Featured movie poster"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Now Showing: Interstellar
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A team of explorers travel through a wormhole in space in an
                attempt to ensure humanity's survival.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Book Now</Button>
              <Button size="lg" variant="outline">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
