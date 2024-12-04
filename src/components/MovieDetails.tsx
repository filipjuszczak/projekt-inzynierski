import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock, Headphones, Monitor, Star } from "lucide-react";
import { ScreenFormat, ViewingMode } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { SCREEN_FORMAT_LABELS, VIEWING_MODE_LABELS } from "@/lib/constants";
import type { EssentialGenreData } from "@/lib/types";

interface MovieDetailsProps {
  posterUrl: string;
  title: string;
  releaseDate: Date;
  duration: number;
  description: string;
  viewingModes: {
    id: number;
    viewingMode: ViewingMode;
  }[];
  screenFormats: {
    id: number;
    screenFormat: ScreenFormat;
  }[];
  genres: EssentialGenreData[];
  rating: string | null;
  director: string | null;
  cast: string | null;
}

export default function MovieDetails({
  posterUrl,
  title,
  releaseDate,
  duration,
  description,
  viewingModes,
  screenFormats,
  genres,
  rating,
  director,
  cast
}: MovieDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="md:col-span-1">
        <Image
          src={posterUrl || "/images/placeholder.jpg"}
          alt={`${title} poster`}
          width={600}
          height={900}
          className="w-full rounded-lg shadow-lg"
          priority
        />
      </div>
      <div className="space-y-6 md:col-span-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(releaseDate, "dd.MM.yyyy")}
                </div>
              </TooltipTrigger>
              <TooltipContent>Data premiery</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Headphones className="mr-2 h-4 w-4" />
                  <div className="flex items-center gap-2">
                    {viewingModes.map((mode) => (
                      <Badge key={mode.id}>
                        {VIEWING_MODE_LABELS[mode.viewingMode]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>Dostępne rodzaje audio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Monitor className="mr-2 h-4 w-4" />
                  <div className="flex items-center gap-2">
                    {screenFormats.map((format) => (
                      <Badge key={format.id}>
                        {SCREEN_FORMAT_LABELS[format.screenFormat]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>Dostępne formaty ekranu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {duration} min
                </div>
              </TooltipTrigger>
              <TooltipContent>Czas trwania</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  {rating || "-"}
                </div>
              </TooltipTrigger>
              <TooltipContent>Ocena</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-2 text-xl font-semibold">Opis</h2>
            <p>{description}</p>
          </CardContent>
        </Card>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Gatunki</h2>
          <div className="flex items-center gap-2">
            {genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Reżyser</h2>
          <p>{director ? director : "Brak danych."}</p>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Obsada</h2>
          {cast ? (
            <ul className="list-inside list-disc">
              {cast.split(", ").map((actor) => (
                <li key={actor}>{actor}</li>
              ))}
            </ul>
          ) : (
            <p>Brak danych.</p>
          )}
        </div>
      </div>
    </div>
  );
}
