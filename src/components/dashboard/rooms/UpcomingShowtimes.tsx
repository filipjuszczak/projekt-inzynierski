import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clapperboard, Clock, Clock10 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface UpcomingShowtimesProps {
  showtimes: {
    id: string;
    startTime: Date;
    endTime: Date;
    movie: {
      title: string;
    };
  }[];
}

export default function UpcomingShowtimes({
  showtimes
}: UpcomingShowtimesProps) {
  if (!showtimes.length) {
    return (
      <div className="text-center">Brak nadchodzących seansów w tej sali.</div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="pb-4 text-3xl font-bold">Nadchodzące seanse:</div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {showtimes.map((showtime) => (
          <Card key={showtime.id} className="w-[350px] justify-self-center">
            <CardHeader>
              <CardTitle>Seans</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center gap-2">
                      <Calendar className="size-4" />
                      {format(showtime.startTime, "dd.MM.yyyy")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Data seansu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2">
                <Clapperboard className="size-4" />
                {showtime.movie.title}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center gap-2">
                      <Clock className="size-4" />
                      {format(showtime.startTime, "HH:mm")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Godzina rozpoczęcia</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center gap-2">
                      <Clock10 className="size-4" />
                      {format(showtime.endTime, "HH:mm")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Godzina zakończenia</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="default" asChild className="mt-6">
                <Link href={`/staff/dashboard/showtimes/${showtime.id}`}>
                  Wyświetl szczegóły
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
