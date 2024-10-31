"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginFormSchema, type LoginValues } from "@/lib/validation";

export async function logIn(
  credentials: LoginValues
): Promise<{ error: string }> {
  try {
    const { email, password } = loginFormSchema.parse(credentials);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Nieprawidłowy adres e-mail lub hasło" };
    }

    const isPasswordValid = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    if (!isPasswordValid) {
      return { error: "Nieprawidłowy adres e-mail lub hasło" };
    }

    if (existingUser.userType === "NORMAL") {
      return { error: "Nie masz dostępu do panelu pracownika" };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/staff/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
