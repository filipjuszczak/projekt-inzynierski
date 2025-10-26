import { z } from "zod";

const requiredString = z.string().min(1, "Pole nie może być puste");
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

export const signupFormSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: z
    .string()
    .min(1, "Pole nie może być puste")
    .email("Niepoprawny adres email"),
  dateOfBirth: z.date().max(twelveYearsAgo, "Musisz mieć co najmniej 12 lat"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  repeatPassword: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  termsAccepted: z
    .boolean()
    .refine((value) => value, { message: "Musisz zaakceptować regulamin" })
});

export type SignupValues = z.infer<typeof signupFormSchema>;

export const loginFormSchema = z.object({
  email: requiredString.email(),
  password: requiredString
});

export type Credentials = z.infer<typeof loginFormSchema>;
