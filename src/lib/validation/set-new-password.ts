import { z } from "zod";

export const setNewPasswordSchema = z
  .object({
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    repeatPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Hasła nie są identyczne"
  });

export type SetNewPasswordValues = z.infer<typeof setNewPasswordSchema>;
