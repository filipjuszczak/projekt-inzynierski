import { z } from "zod";

export const createRoomFormSchema = z.object({
  number: z.string().min(1, "Pole nie może być puste"),
  numberOfRows: z.string().min(1, "Pole nie może być puste"),
  seatsPerRow: z.string().min(1, "Pole nie może być puste")
});

export type CreateRoomValues = z.infer<typeof createRoomFormSchema>;

export const editRoomFormSchema = z.object({
  number: z.string().optional(),
  numberOfRows: z.string().optional(),
  seatsPerRow: z.string().optional()
});

export type EditRoomValues = z.infer<typeof editRoomFormSchema>;
