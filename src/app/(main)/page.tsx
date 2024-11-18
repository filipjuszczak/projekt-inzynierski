import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Hero from "@/app/(main)/Hero";

export default function Page() {
  return (
    <main className="flex-1">
      <Hero />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold tracking-tighter sm:text-5xl">
            Now Showing
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((movie) => (
              <Card key={movie}>
                <CardHeader className="p-0">
                  <Image
                    src="/images/image-placeholder.svg"
                    alt={`Movie ${movie}`}
                    width={600}
                    height={400}
                    className="aspect-[3/2] rounded-t-lg object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-bold">
                    Movie Title {movie}
                  </CardTitle>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Release Date</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>Cinema Location</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full">Book Tickets</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
