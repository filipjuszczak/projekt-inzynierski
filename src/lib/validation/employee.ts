import { z } from "zod";

const requiredString = z.string().trim().min(1, "Pole nie może być puste");

export const employeeSchema = z.object({
  userType: requiredString,
  username: z.string().optional(),
  firstName: requiredString,
  lastName: requiredString,
  email: requiredString.email("Niepoprawny adres email"),
  dayOfBirth: z.string().min(1, "Pole nie może być puste"),
  monthOfBirth: z.string().min(1, "Pole nie może być puste"),
  yearOfBirth: z.string().min(1, "Pole nie może być puste")
});

export type EmployeeValues = z.infer<typeof employeeSchema>;

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  repeatNewPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
