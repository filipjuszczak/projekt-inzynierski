"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import MovieCard from "@/components/MovieCard";

interface LatestMoviesProps {
  movies: {
    id: string;
    title: string;
    releaseDate: Date;
    posterUrl: string | null;
    shortDescription: string;
    genres: string[];
  }[];
}

export default function LatestMovies({ movies }: LatestMoviesProps) {
  return (
    <Carousel
      opts={{
        align: "start"
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnMouseEnter: true,
          stopOnFocusIn: true
        })
      ]}
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="flex flex-col md:basis-1/2 lg:basis-1/4"
          >
            <MovieCard
              {...movie}
              sizes="(max-width: 450px) 100vw, (min-width: 450px) 60vw, (min-width: 640px) 100vw, (min-width: 768px) 50vw, (min-width: 1024px) 25vw"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 h-12 w-12 md:-translate-x-1/2 lg:left-1/2 lg:top-[unset] lg:-translate-x-[200%] lg:translate-y-[100%]" />
      <CarouselNext className="right-0 h-12 w-12 md:translate-x-1/2 lg:right-1/2 lg:top-[unset] lg:translate-x-[200%] lg:translate-y-[100%]" />
    </Carousel>
  );
}
