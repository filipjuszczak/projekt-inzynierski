import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const showtimeSchema = z.object({
  movieId: requiredString,
  roomId: requiredString,
  startDate: z.date().min(new Date(), "Data musi być w przyszłości"),
  startTimeHour: requiredString.refine(
    (value) => Number(value) >= 0 && Number(value) <= 23,
    { message: "Godzina musi być w zakresie od 0 do 23" }
  ),
  startTimeMinute: requiredString.refine(
    (value) => Number(value) >= 0 && Number(value) <= 59,
    { message: "Minuta musi być w zakresie od 0 do 59" }
  )
});

export type ShowtimeValues = z.infer<typeof showtimeSchema>;
