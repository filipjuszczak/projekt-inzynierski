import { z } from "zod";

export const createShowtimeFormSchema = z.object({
  movieId: z.string().min(1, "Pole nie może być puste"),
  roomId: z.string().min(1, "Pole nie może być puste"),
  startDate: z.date().min(new Date(), "Data musi być w przyszłości"),
  startTimeHour: z.string().min(1, "Pole nie może być puste"),
  startTimeMinute: z.string().min(1, "Pole nie może być puste")
});

export type CreateShowtimeValues = z.infer<typeof createShowtimeFormSchema>;

export const editShowtimeFormSchema = z.object({
  movieId: z.string().optional(),
  roomId: z.string().optional(),
  startDate: z.date().optional(),
  startTimeHour: z.string().optional(),
  startTimeMinute: z.string().optional()
});

export type EditShowtimeValues = z.infer<typeof editShowtimeFormSchema>;
