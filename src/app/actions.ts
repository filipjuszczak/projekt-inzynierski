"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { hash, verify } from "@node-rs/argon2";
import { UserActivities, Role } from "@prisma/client";
import PasswordChangedEmail from "@/components/emails/PasswordChangedEmail";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { authenticateUser, lucia } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import {
  changePasswordSchema,
  type ChangePasswordValues
} from "@/lib/validation/employee";
import { isValidEmail, passwordsMatch } from "@/lib/utils";
import { HASHING_CONFIG } from "@/lib/constants";
import { loginFormSchema, type Credentials } from "@/lib/validation/auth";
import type { UserData } from "@/lib/types";

const userSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  role: true,
  isActivated: true,
  isLocked: true
};

export async function logIn(
  role: Role,
  credentials: Credentials
): Promise<{ error: string } | { success: boolean; userData: UserData }> {
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

    if (!existingUser || !existingUser.password) {
      return {
        error: "Nieprawidłowa nazwa użytkownika / adres e-mail lub hasło."
      };
    }

    if (!existingUser.isActivated) {
      return { error: "Konto nie zostało jeszcze aktywowane." };
    }

    if (existingUser.isLocked) {
      return {
        error:
          "Konto zostało zablokowane. Jeśli została wysłana prośba o reset hasła, sprawdź swoją skrzynkę pocztową."
      };
    }

    const isPasswordValid = await verify(
      existingUser.password,
      password,
      HASHING_CONFIG
    );

    if (!isPasswordValid) {
      return {
        error: "Nieprawidłowa nazwa użytkownika / adres e-mail lub hasło."
      };
    }

    if (role === Role.EMPLOYEE && existingUser.role === Role.NORMAL) {
      return { error: "Nie masz dostępu do panelu pracownika." };
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
        role: existingUser.role
      }
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function logOut(role: Role) {
  try {
    const requestCookies = await cookies();
    const sessionCookie = requestCookies.get("auth_session");

    if (!sessionCookie) {
      return { error: "Brak ciasteczka sesji." };
    }

    const { session } = await authenticateUser(role, sessionCookie);

    if (!session || !session.userId) {
      return { error: "Sesja nie istnieje." };
    }

    await lucia.invalidateSession(session.id);

    const blankSessionCookie = lucia.createBlankSessionCookie();
    requestCookies.set(
      blankSessionCookie.name,
      blankSessionCookie.value,
      blankSessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function changePassword(
  userId: string,
  role: Role,
  values: ChangePasswordValues
) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      if (role === Role.EMPLOYEE) {
        return redirect("/panel-pracownika/logowanie");
      } else {
        return redirect("/logowanie");
      }
    }

    const { session } = await authenticateUser(role, requestSessionCookie);

    if (!session || !session.userId) {
      if (role === Role.EMPLOYEE || role === Role.ADMIN) {
        return redirect("/panel-pracownika/logowanie");
      } else {
        return redirect("/logowanie");
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, password: true, email: true }
    });

    if (!existingUser) {
      return {
        error: "Nie znaleziono użytkownika o podanym adresie e-mail."
      };
    }

    const lastPasswordChange = await prisma.userActivity.findFirst({
      where: {
        userId,
        type: UserActivities.PASSWORD_CHANGED,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    if (lastPasswordChange) {
      return {
        error: "Możesz zmienić hasło tylko raz na dobę. Spróbuj ponownie jutro."
      };
    }

    const { oldPassword, newPassword, repeatNewPassword } =
      changePasswordSchema.parse(values);

    // const existingUser = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { id: true, firstName: true, password: true, email: true }
    // });

    // if (!existingUser) {
    //   return {
    //     error: "Nie znaleziono użytkownika o podanym adresie e-mail."
    //   };
    // }

    const isOldPasswordCorrect = await verify(
      existingUser.password,
      oldPassword,
      HASHING_CONFIG
    );

    if (!isOldPasswordCorrect) {
      return { error: "Stare hasło jest niepoprawne." };
    }

    if (!passwordsMatch(newPassword, repeatNewPassword)) {
      return { error: "Hasła nie są takie same." };
    }

    if (newPassword === oldPassword) {
      return { error: "Hasło nie może być takie samo jak aktualne." };
    }

    const newHashedPassword = await hash(newPassword, HASHING_CONFIG);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: { password: newHashedPassword, mustChangePassword: false }
      }),
      prisma.userActivity.create({
        data: {
          userId: existingUser.id,
          type: UserActivities.PASSWORD_CHANGED
        }
      })
    ]);

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [existingUser.email],
      subject: "Cinema - zmiana hasła",
      react: PasswordChangedEmail({ firstName: existingUser.firstName })
    });

    if (resendError) {
      return {
        error:
          "Hasło zostało zmienione, ale nie udało się wysłać wiadomości e-mail."
      };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
