import z from "zod";

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Pole nie może być puste")
});

export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;
