"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MovieCard from "@/components/MovieCard";

interface UpcomingMoviesProps {
  movies: {
    id: string;
    title: string;
    releaseDate: Date;
    posterUrl: string | null;
    shortDescription: string;
    genres: string[];
  }[];
}

export default function UpcomingMovies({ movies }: UpcomingMoviesProps) {
  return (
    <Carousel
      opts={{
        align: "start"
      }}
      plugins={[
        Autoplay({
          delay: 3000
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
}

interface MovieCardProps {
  title: string;
  posterUrl: string | null;
  releaseDate: Date;
}

// function MovieCard({ title, posterUrl, releaseDate }: MovieCardProps) {
//   return (
//     <Card className="overflow-hidden md:basis-1/2 lg:basis-1/3">
//       <CardHeader className="p-0">
//         <div className="relative aspect-[2/3] w-full p-0">
//           <Image
//             src={posterUrl || "/images/image-placeholder.svg"}
//             alt={`Plakat filmu ${title}`}
//             fill
//             className="aspect-[2/3] rounded-t-lg object-cover"
//           />
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4 p-4">
//         <div className="flex justify-between">
//           <h3 className="truncate text-lg font-bold">{title}</h3>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Badge variant="secondary" className="flex max-w-fit gap-2">
//                   <span className="sr-only">Data premiery</span>
//                   <Calendar className="size-4 text-muted-foreground" />
//                   {format(releaseDate, "dd.MM.yyyy")}
//                 </Badge>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Data premiery</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//         <Link
//           href={`/filmy/${encodeURIComponent(title)}`}
//           className={cn(buttonVariants({ variant: "default" }), "w-full")}
//         >
//           Zobacz szczegóły
//         </Link>
//       </CardContent>
//     </Card>
//   );
// }
