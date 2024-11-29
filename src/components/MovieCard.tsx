import Link from "next/link";
import Image from "next/image";
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
    <Card key={id} className="flex w-full flex-col">
      <CardHeader className="relative aspect-[2/3] w-full p-0">
        <Image
          src={posterUrl || "/images/image-placeholder.svg"}
          alt={`Plakat filmu ${title}`}
          // width={400}
          fill
          // height={600}
          className="aspect-[2/3] rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-2 p-4 pb-10">
        {/* <CardTitle className="max-w-full truncate text-lg font-bold">
          {title}
        </CardTitle> */}
        <CardTitle className="max-w-fit truncate text-lg font-bold">
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
        <div className="line-clamp-3 max-w-[40ch] text-pretty text-sm text-muted-foreground">
          {shortDescription}
        </div>
      </CardContent>
      <CardFooter className="mt-auto px-4">
        <Link
          href={`/filmy/${encodeURIComponent(title)}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Zarezerwuj bilety
        </Link>
      </CardFooter>
    </Card>
  );
}
