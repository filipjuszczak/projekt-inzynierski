import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");
const ageRestrictions = ["0", "12", "15", "18"];

export const genreSchema = z.object({
  name: requiredString,
  ageRestriction: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Wiek musi być liczbą"
    })
    .refine((value) => ageRestrictions.includes(value), {
      message: "Nieprawidłowe ograniczenie wiekowe"
    })
});

export type GenreValues = z.infer<typeof genreSchema>;
