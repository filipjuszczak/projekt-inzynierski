import Link from "next/link";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import Genres from "@/components/GenresBadges";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: string;
  posterUrl: string | null;
  title: string;
  releaseDate: Date;
  genres: string[];
  shortDescription: string;
}

export default function MovieCard({
  id,
  posterUrl,
  title,
  releaseDate,
  genres,
  shortDescription
}: MovieCardProps) {
  return (
    <Card key={id} className="flex w-full flex-grow flex-col overflow-hidden">
      <CardHeader className="relative aspect-[2/3] w-full p-0">
        <ImageWithLoader
          src={posterUrl || "/images/image-placeholder.svg"}
          alt={`Plakat filmu ${title}`}
          fill
          className="aspect-[2/3] rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-2 p-4 pb-8">
        <CardTitle
          className="max-w-fit truncate text-lg font-bold"
          title={title}
        >
          {title}
        </CardTitle>
        <div className="flex max-w-full justify-between gap-2 overflow-hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex max-w-fit items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{format(releaseDate, "dd.MM.yyyy")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data premiery</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Genres genres={genres} />
        </div>
        <div
          className="line-clamp-3 max-w-[40ch] text-pretty text-sm text-muted-foreground"
          title={shortDescription}
        >
          {shortDescription}
        </div>
      </CardContent>
      <CardFooter className="mt-auto px-4">
        <Link
          href={`/filmy/${encodeURIComponent(title)}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Wyświetl szczegóły
        </Link>
      </CardFooter>
    </Card>
  );
}
