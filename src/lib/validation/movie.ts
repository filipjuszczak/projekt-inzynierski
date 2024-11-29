import { z } from "zod";
import { ViewingMode, ScreenFormat } from "@prisma/client";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const movieSchema = z.object({
  title: requiredString,
  posterImage: z.any().optional(),
  description: requiredString,
  shortDescription: requiredString,
  releaseDate: z.date(),
  duration: requiredString,
  viewingModes: z
    .array(z.enum([ViewingMode.SUBTITLES, ViewingMode.DUBBING]))
    .min(1, "Musisz wybrać co najmniej jeden rodzaj audio"),
  screenFormats: z
    .array(
      z.enum([ScreenFormat.TWO_D, ScreenFormat.THREE_D, ScreenFormat.IMAX])
    )
    .min(1, "Musisz wybrać co najmniej jeden format obrazu"),
  genres: z.array(z.string()).min(1, "Musisz wybrać co najmniej jeden gatunek")
});

export type MovieValues = z.infer<typeof movieSchema>;
