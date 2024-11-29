import { z } from "zod";

const requiredString = z.string().min(1, "Pole nie może być puste");
const today = new Date();
today.setHours(0, 0, 0, 0);

export const employeeSchema = z.object({
  role: requiredString,
  username: z.string().optional(),
  firstName: requiredString,
  lastName: requiredString,
  email: requiredString.email("Niepoprawny adres email"),
  dateOfBirth: z.date().max(today, "Data musi być w przeszłości")
});

export type EmployeeValues = z.infer<typeof employeeSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  newPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
  repeatNewPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
