import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const movieSchema = z.object({
  title: requiredString,
  posterImage: z.any().optional(),
  description: requiredString,
  releaseDate: z.date(),
  duration: requiredString,
  genres: z.array(z.string()).min(1, "Musisz wybrać co najmniej jeden gatunek")
});

export type MovieValues = z.infer<typeof movieSchema>;
