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
          <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/4">
            <MovieCard {...movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 h-12 w-12 md:-translate-x-1/2 lg:left-1/2 lg:top-[unset] lg:-translate-x-[200%] lg:translate-y-[100%]" />
      <CarouselNext className="right-0 h-12 w-12 md:translate-x-1/2 lg:right-1/2 lg:top-[unset] lg:translate-x-[200%] lg:translate-y-[100%]" />
    </Carousel>
  );
  // return (
  //   <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  //     {movies.map((movie) => (
  //       <Card key={movie.id} className="max-w-fit">
  //         <CardHeader className="p-0">
  //           <Image
  //             src={movie.posterUrl || "/images/image-placeholder.svg"}
  //             alt={`Plakat filmu ${movie.title}`}
  //             width={400}
  //             height={600}
  //             className="aspect-[2/3] rounded-t-lg object-cover"
  //           />
  //         </CardHeader>
  //         <CardContent className="space-y-2 p-4">
  //           <CardTitle className="max-w-full truncate text-lg font-bold">
  //             {movie.title}
  //           </CardTitle>
  //           <TooltipProvider>
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <div className="flex max-w-fit items-center text-sm text-muted-foreground">
  //                   <Calendar className="mr-1 h-4 w-4" />
  //                   <span>{format(movie.releaseDate, "dd.MM.yyyy")}</span>
  //                 </div>
  //               </TooltipTrigger>
  //               <TooltipContent>
  //                 <p>Data premiery</p>
  //               </TooltipContent>
  //             </Tooltip>
  //           </TooltipProvider>

  //           <Genres genres={movie.genres} />
  //           <div className="line-clamp-3 max-w-[40ch] text-pretty text-sm text-muted-foreground">
  //             {movie.shortDescription}
  //           </div>
  //         </CardContent>
  //         <CardFooter className="p-4">
  //           <Link
  //             href={`/filmy/${encodeURIComponent(movie.title)}`}
  //             className={cn(buttonVariants({ variant: "default" }), "w-full")}
  //           >
  //             Zarezerwuj bilety
  //           </Link>
  //         </CardFooter>
  //       </Card>
  //     ))}
  //   </div>
  // );
}
