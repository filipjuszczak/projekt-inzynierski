import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const roomSchema = z.object({
  number: requiredString,
  numberOfRows: requiredString,
  seatsPerRow: requiredString
});

export type RoomValues = z.infer<typeof roomSchema>;
