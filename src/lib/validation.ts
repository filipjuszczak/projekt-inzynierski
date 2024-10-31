import { z } from "zod";

export const signupFormSchema = z.object({
  firstName: z.string().min(1, "Pole nie może być puste"),
  lastName: z.string().min(1, "Pole nie może być puste"),
  email: z
    .string()
    .min(1, "Pole nie może być puste")
    .email("Niepoprawny adres email"),
  dayOfBirth: z.string().min(1, "Pole nie może być puste"),
  monthOfBirth: z.string().min(1, "Pole nie może być puste"),
  yearOfBirth: z.string().min(1, "Pole nie może być puste"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  confirmedPassword: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  terms: z
    .boolean()
    .refine((value) => value, { message: "Musisz zaakceptować regulamin" })
});

export type SignupValues = z.infer<typeof signupFormSchema>;

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Pole nie może być puste")
    .email("Niepoprawny adres email"),
  password: z.string().min(1, "Pole nie może być puste")
});

export type LoginValues = z.infer<typeof loginFormSchema>;
