"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import {
  loginFormSchema,
  signupFormSchema,
  type LoginValues,
  type SignupValues
} from "@/lib/validation";
import { isValidDate, passwordsMatch } from "@/lib/utils";
import { lucia } from "@/auth";

export async function signUp(data: SignupValues): Promise<{ error: string }> {
  try {
    const {
      firstName,
      lastName,
      email,
      dayOfBirth,
      monthOfBirth,
      yearOfBirth,
      password,
      confirmedPassword
    } = signupFormSchema.parse(data);

    if (!isValidDate(dayOfBirth, monthOfBirth, yearOfBirth)) {
      return { error: "Nieprawidłowa data" };
    }

    if (!passwordsMatch(password, confirmedPassword)) {
      return { error: "Hasła nie są identyczne" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Użytkownik o podanym adresie email już istnieje" };
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    await prisma.user.create({
      data: {
        id: userId,
        firstName,
        lastName,
        email,
        dateOfBirth: new Date(
          Number(yearOfBirth),
          Number(monthOfBirth) - 1,
          Number(dayOfBirth)
        ),
        passwordHash
      }
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

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

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
