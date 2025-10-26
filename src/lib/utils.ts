import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { addMinutes, isValid as isValidDate } from "date-fns";
import {
  checkoutFormSchema,
  type CheckoutFormValues
} from "@/lib/validation/checkout";
import type { UseFormReturn } from "react-hook-form";
import type { SignupValues } from "@/lib/validation/auth";
import type { EmployeeValues } from "@/lib/validation/employee";
import type { UpdateUserDataValues } from "@/lib/validation/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function passwordsMatch(password: string, repeatPassword: string) {
  return password === repeatPassword;
}

const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export function isValidEmail(email: string) {
  return validEmailRegex.test(email);
}

export const forbiddenUsernames = [
  "admin",
  "administrator",
  "moderator",
  "mod",
  "superuser",
  "super",
  "root",
  "user",
  "users",
  "username",
  "usernames",
  "name",
  "names",
  "login",
  "logins",
  "account",
  "accounts",
  "profile",
  "profiles",
  "signup",
  "sign-up",
  "register",
  "registration",
  "join",
  "signin",
  "sign-in",
  "auth",
  "authentication",
  "authorize",
  "helpdesk",
  "support",
  "bot",
  "api",
  "webmaster",
  "null",
  "undefined",
  "anonymous",
  "security",
  "marketing",
  "sales",
  "contact",
  "info",
  "privacy",
  "terms"
];

export const allowedUsernameRegex = /^[a-zA-Z0-9_]{2,20}$/;

function checkPasswordConditions(password: string, repeatPassword: string) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === repeatPassword;

  return (
    minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    passwordsMatch
  );
}

export function validateSignupValues(
  form: UseFormReturn<SignupValues>,
  values: SignupValues
) {
  let isValid = true;

  if (!isValidDate(values.dateOfBirth)) {
    form.setError("dateOfBirth", {
      type: "value",
      message: "Nieprawidłowa data"
    });
    isValid = false;
  }

  const now = new Date();
  const diff = now.getTime() - values.dateOfBirth.getTime();
  const twelveYears = 12 * 365 * 24 * 60 * 60 * 1000;
  const isOldEnough = diff >= twelveYears;

  if (!isOldEnough) {
    form.setError("dateOfBirth", {
      type: "value",
      message: "Musisz mieć co najmniej 12 lat"
    });
    isValid = false;
  }

  if (!passwordsMatch(values.password, values.repeatPassword)) {
    form.setError("repeatPassword", {
      type: "value",
      message: "Hasła nie są identyczne"
    });
    isValid = false;
  }

  if (!checkPasswordConditions(values.password, values.repeatPassword)) {
    form.setError("password", {
      type: "value",
      message: "Hasło nie spełnia wymagań"
    });
    isValid = false;
  }

  return isValid;
}

export function validateUserDataValues(
  form: UseFormReturn<UpdateUserDataValues>,
  values: UpdateUserDataValues
) {
  let isValid = true;

  if (!isValidDate(values.dateOfBirth)) {
    form.setError("dateOfBirth", {
      type: "value",
      message: "Nieprawidłowa data"
    });
    isValid = false;
  }

  const now = new Date();
  const diff = now.getTime() - values.dateOfBirth.getTime();
  const twelveYears = 12 * 365 * 24 * 60 * 60 * 1000;
  const isOldEnough = diff >= twelveYears;

  if (!isOldEnough) {
    form.setError("dateOfBirth", {
      type: "value",
      message: "Musisz mieć co najmniej 12 lat"
    });
    isValid = false;
  }

  return isValid;
}

export function validateEmployeeValues(
  form: UseFormReturn<EmployeeValues>,
  values: EmployeeValues
) {
  let isValid = true;

  if (!isValidDate(values.dateOfBirth)) {
    form.setError("dateOfBirth", {
      type: "value",
      message: "Nieprawidłowa data"
    });
    isValid = false;
  }

  return isValid;
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createActivationToken() {
  const token = generateToken();
  const tokenExpiresAt = addMinutes(new Date(), 15);

  return { token, tokenExpiresAt };
}

export function validateCheckoutValues(values: CheckoutFormValues) {
  const { success, data } = checkoutFormSchema.safeParse(values);

  return success ? data : null;
}

export function isUserOldEnough(
  birthDate: Date,
  ageRestriction: number
): boolean {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= ageRestriction;
}

export function generateRandomPassword(length: number) {
  return Math.random().toString(36).slice(-length);
}
