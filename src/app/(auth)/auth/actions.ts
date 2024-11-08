"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { authUser, lucia } from "@/auth";
import prisma from "@/lib/prisma";
import {
  loginFormSchema,
  signupFormSchema,
  type Credentials,
  type SignupValues
} from "@/lib/validation/auth";
import {
  forbiddenUsernames,
  isValidDate,
  isValidEmail,
  passwordsMatch,
  allowedUsernameRegex
} from "@/lib/utils";
import type { UserData } from "@/lib/types";

export async function signUp(
  data: SignupValues
): Promise<{ error: string } | UserData> {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      dayOfBirth,
      monthOfBirth,
      yearOfBirth,
      password,
      confirmedPassword
    } = signupFormSchema.parse(data);

    if (username && !allowedUsernameRegex.test(username)) {
      return { error: "Nazwa użytkownika zawiera niedozwolone znaki" };
    }

    if (username && forbiddenUsernames.includes(username.toLowerCase())) {
      return { error: "Nazwa użytkownika jest zablokowana" };
    }

    if (!isValidDate(dayOfBirth, monthOfBirth, yearOfBirth)) {
      return { error: "Nieprawidłowa data" };
    }

    const now = new Date();
    const birthDate = new Date(
      Number(yearOfBirth),
      Number(monthOfBirth) - 1,
      Number(dayOfBirth)
    );

    const diff = now.getTime() - birthDate.getTime();
    const isOldEnough = diff >= 12 * 365 * 24 * 60 * 60 * 1000;

    if (!isOldEnough) {
      return { error: "Musisz mieć co najmniej 12 lat" };
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

    const createdUser = await prisma.user.create({
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
        passwordHash,
        username: username || null
      }
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      userData: {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        username: createdUser.username || "",
        email: createdUser.email,
        userType: createdUser.userType
      }
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function logIn(
  credentials: Credentials
): Promise<{ error: string } | UserData> {
  try {
    const { login, password } = loginFormSchema.parse(credentials);

    const existingUser = isValidEmail(login)
      ? await prisma.user.findUnique({ where: { email: login } })
      : await prisma.user.findUnique({ where: { username: login } });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Nieprawidłowa nazwa użytkownika / adres e-mail lub hasło"
      };
    }

    const isPasswordValid = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    if (!isPasswordValid) {
      return {
        error: "Nieprawidłowa nazwa użytkownika / adres e-mail lub hasło"
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      userData: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username || "",
        email: existingUser.email,
        userType: existingUser.userType
      }
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function logOut() {
  const { session } = await authUser();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/login");
}
