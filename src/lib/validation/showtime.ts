import { z } from "zod";
import { ViewingMode, ScreenFormat } from "@prisma/client";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const showtimeSchema = z.object({
  movieId: requiredString,
  roomId: requiredString,
  startTime: z.date(),
  viewingMode: z.enum([ViewingMode.SUBTITLES, ViewingMode.DUBBING]),
  screenFormat: z.enum([
    ScreenFormat.TWO_D,
    ScreenFormat.THREE_D,
    ScreenFormat.IMAX
  ])
});

export type ShowtimeValues = z.infer<typeof showtimeSchema>;
