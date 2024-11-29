import { z } from "zod";

export const setNewPasswordSchema = z.object({
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  repeatPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
});

export type SetNewPasswordValues = z.infer<typeof setNewPasswordSchema>;
