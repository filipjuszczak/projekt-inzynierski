"use server";

import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import { isValidEmail } from "@/lib/utils";
import { loginFormSchema, type Credentials } from "@/lib/validation/auth";
import type { UserData } from "@/lib/types";

const userSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  passwordHash: true,
  userType: true
};

export async function logIn(
  credentials: Credentials
): Promise<{ error: string } | UserData> {
  try {
    const { login, password } = loginFormSchema.parse(credentials);
    const existingUser = isValidEmail(login)
      ? await prisma.user.findUnique({
          where: { email: login },
          select: userSelect
        })
      : await prisma.user.findUnique({
          where: { username: login },
          select: userSelect
        });

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

    return {
      success: true,
      userData: {
        username: existingUser.username || "",
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
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
  try {
    const { session } = await authEmployee();
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

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
