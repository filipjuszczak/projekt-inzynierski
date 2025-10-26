import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");
const now = new Date();
const twelveYearsAgo = new Date(
  now.getFullYear() - 12,
  now.getMonth(),
  now.getDate(),
  23,
  59,
  59,
  999
);

export const updateUserDataSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: requiredString.email("Nieprawidłowy adres e-mail"),
  dateOfBirth: z.date().max(twelveYearsAgo, "Musisz mieć co najmniej 12 lat")
});

export type UpdateUserDataValues = z.infer<typeof updateUserDataSchema>;

export const updateAccountSettingsSchema = z.object({
  newsletterConsent: z.boolean()
});

export type UpdateAccountSettingsValues = z.infer<
  typeof updateAccountSettingsSchema
>;
