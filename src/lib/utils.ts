import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { SignupValues } from "@/lib/validation/auth";
import type { MovieValues } from "@/lib/validation/movie";
import type { EmployeeValues } from "@/lib/validation/employee";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidDate(day: string, month: string, year: string) {
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    date.getDate() === Number(day) &&
    date.getMonth() === Number(month) - 1 &&
    date.getFullYear() === Number(year)
  );
}

export function passwordsMatch(password: string, confirmPassword: string) {
  return password === confirmPassword;
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

export function validateSignupValues(
  form: UseFormReturn<SignupValues>,
  values: SignupValues
) {
  let isValid = true;

  if (values.username) {
    if (!allowedUsernameRegex.test(values.username)) {
      form.setError("username", {
        type: "manual",
        message: "Nazwa użytkownika zawiera niedozwolone znaki"
      });
      isValid = false;
    }

    if (forbiddenUsernames.includes(values.username.toLowerCase())) {
      form.setError("username", {
        type: "manual",
        message: "Ta nazwa użytkownika jest zablokowana"
      });
      isValid = false;
    }
  }

  if (
    !isValidDate(values.dayOfBirth, values.monthOfBirth, values.yearOfBirth)
  ) {
    form.setError("dayOfBirth", {
      type: "manual",
      message: "Nieprawidłowy dzień dla podanego miesiąca"
    });
    isValid = false;
  }

  const now = new Date();
  const birthDate = new Date(
    Number(values.yearOfBirth),
    Number(values.monthOfBirth) - 1,
    Number(values.dayOfBirth)
  );

  const diff = now.getTime() - birthDate.getTime();
  const isOldEnough = diff >= 12 * 365 * 24 * 60 * 60 * 1000;

  if (!isOldEnough) {
    form.setError("dayOfBirth", {
      type: "manual",
      message: ""
    });
    form.setError("monthOfBirth", {
      type: "manual",
      message: ""
    });
    form.setError("yearOfBirth", {
      type: "manual",
      message: "Musisz mieć co najmniej 12 lat"
    });
    isValid = false;
  }

  if (!passwordsMatch(values.password, values.confirmedPassword)) {
    form.setError("confirmedPassword", {
      type: "manual",
      message: "Hasła nie są identyczne"
    });
    isValid = false;
  }

  return isValid;
}

export function validateMovieValues(
  form: UseFormReturn<MovieValues>,
  values: MovieValues
) {
  let isValid = true;

  if (Number(values.duration) < 1) {
    form.setError("duration", {
      type: "manual",
      message: "Czas trwania filmu musi być większy niż 0."
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

  if (
    !isValidDate(values.dayOfBirth, values.monthOfBirth, values.yearOfBirth)
  ) {
    form.setError("dayOfBirth", {
      type: "manual",
      message: "Nieprawidłowy dzień dla podanego miesiąca"
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
