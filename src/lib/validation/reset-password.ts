import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Pole nie może być puste")
    .email("Nieprawidłowy adres e-mail")
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
