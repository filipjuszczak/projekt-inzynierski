import { z } from "zod";

export const createMovieFormSchema = z.object({
  title: z.string().min(1, "Pole nie może być puste"),
  description: z
    .string()
    .min(1, "Pole nie może być puste")
    .max(500, "Opis nie może być dłuższy niż 500 znaków"),
  releaseYear: z.string().min(1, "Pole nie może być puste"),
  duration: z.string().min(1, "Pole nie może być puste"),
  genres: z.array(z.string()).min(1, "Musisz wybrać co najmniej jeden gatunek")
});

export type CreateMovieValues = z.infer<typeof createMovieFormSchema>;

export const editMovieFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  releaseYear: z.string().optional(),
  duration: z.string().optional(),
  genres: z.array(z.string()).optional()
});

export type EditMovieValues = z.infer<typeof editMovieFormSchema>;
