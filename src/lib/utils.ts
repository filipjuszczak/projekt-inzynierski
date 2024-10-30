import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
