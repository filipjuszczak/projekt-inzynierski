import { z } from "zod";

export const createGenreFormSchema = z.object({
  name: z.string().min(1, "Pole nie może być puste"),
  ageRestriction: z.string().refine((value) => !isNaN(Number(value)), {
    message: "Wiek musi być liczbą"
  })
});

export type CreateGenreValues = z.infer<typeof createGenreFormSchema>;

export const editGenreFormSchema = z.object({
  name: z.string().optional(),
  ageRestriction: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Wiek musi być liczbą"
    })
    .optional()
});

export type EditGenreValues = z.infer<typeof editGenreFormSchema>;
