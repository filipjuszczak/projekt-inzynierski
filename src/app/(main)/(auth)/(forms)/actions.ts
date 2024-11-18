"use server";

import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { addMinutes, isValid as isValidDate } from "date-fns";
import { TokenType } from "@prisma/client";
import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import ConfirmPasswordResetEmail from "@/components/emails/ConfirmPasswordResetEmail";
import { authUser, lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import {
  forbiddenUsernames,
  isValidEmail,
  passwordsMatch,
  allowedUsernameRegex,
  createActivationToken
} from "@/lib/utils";
import {
  loginFormSchema,
  signupFormSchema,
  type Credentials,
  type SignupValues
} from "@/lib/validation/auth";
import type { UserData } from "@/lib/types";

export async function signUp(
  data: SignupValues
): Promise<{ error: string } | { success: boolean }> {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      repeatPassword,
      termsAccepted
    } = signupFormSchema.parse(data);

    if (username && !allowedUsernameRegex.test(username)) {
      return { error: "Nazwa użytkownika zawiera niedozwolone znaki" };
    }

    if (username && forbiddenUsernames.includes(username.toLowerCase())) {
      return { error: "Nazwa użytkownika jest zablokowana" };
    }

    if (!isValidDate(dateOfBirth)) {
      return { error: "Nieprawidłowa data" };
    }

    const now = new Date();
    const diff = now.getTime() - dateOfBirth.getTime();
    const twelveYears = 12 * 365 * 24 * 60 * 60 * 1000;
    const isOldEnough = diff >= twelveYears;

    if (!isOldEnough) {
      return { error: "Musisz mieć co najmniej 12 lat" };
    }

    if (!passwordsMatch(password, repeatPassword)) {
      return { error: "Hasła nie są identyczne" };
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { email: true }
    });

    if (existingEmail) {
      return { error: "Użytkownik o podanym adresie email już istnieje" };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { username: true }
    });

    if (existingUsername) {
      return { error: "Nazwa użytkownika jest już zajęta" };
    }

    if (!termsAccepted) {
      return { error: "Musisz zaakceptować regulamin" };
    }

    // const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    const createdUser = await prisma.user.create({
      data: {
        // id: userId,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth,
        passwordHash,
        isActivated: false
      },
      select: {
        id: true
      }
    });

    const { token, tokenExpiresAt } = createActivationToken();

    await prisma.token.create({
      data: {
        userId: createdUser.id,
        type: TokenType.ACTIVATION,
        value: token,
        expiresAt: tokenExpiresAt,
        isActive: true
      }
    });

    const encodedEmail = encodeURIComponent(email);
    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/aktywuj-konto/?email=${encodedEmail}&token=${token}`;

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - witamy!",
      react: AccountActivationEmail({ firstName, link: activationLink })
    });

    if (resendError) {
      console.error(resendError);
      return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

const userSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  passwordHash: true,
  userType: true,
  isActivated: true
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

    if (!existingUser.isActivated) {
      return { error: "Konto nie zostało jeszcze aktywowane." };
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

  return { success: true };
}

export async function requestPasswordReset(email: string) {
  try {
    if (!isValidEmail(email)) {
      return { error: "Nieprawidłowy adres e-mail." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return { error: "Nie znaleziono użytkownika o podanym adresie e-mail." };
    }

    const previousToken = await prisma.token.findFirst({
      where: { userId: existingUser.id, type: TokenType.PASSWORD_RESET }
    });

    if (
      previousToken &&
      new Date(previousToken.createdAt) > addMinutes(new Date(), -15)
    ) {
      return {
        error:
          "Prośba o zresetowanie hasła została niedawno wysłana. Sprawdź skrzynkę pocztową lub odczekaj 15 minut, zanim wyślesz kolejną prośbę."
      };
    }

    const { token, tokenExpiresAt } = createActivationToken();
    const passwordResetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/zresetuj-haslo/?token=${token}`;

    await prisma.token.create({
      data: {
        userId: existingUser.id,
        type: TokenType.PASSWORD_RESET,
        value: token,
        isActive: true,
        expiresAt: tokenExpiresAt
      }
    });

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - reset password",
      react: ResetPasswordEmail({
        firstName: existingUser.firstName,
        link: passwordResetLink
      })
    });

    if (resendError) {
      console.error(resendError);
      return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function setNewPassword(token: string, newPassword: string) {
  try {
    const existingToken = await prisma.token.findFirst({
      where: { value: token, type: TokenType.PASSWORD_RESET, isActive: true }
    });

    if (!existingToken) {
      return { error: "Nieprawidłowy token." };
    }

    if (new Date(existingToken.expiresAt) < new Date()) {
      return { error: "Token wygasł." };
    }

    const newPasswordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    const user = await prisma.user.update({
      where: { id: existingToken.userId },
      data: {
        passwordHash: newPasswordHash
      },
      select: {
        firstName: true,
        email: true
      }
    });

    await prisma.token.update({
      where: { id: existingToken.id },
      data: {
        isActive: false
      }
    });

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [user.email],
      subject: "Cinema - hasło zostało zmienione",
      react: ConfirmPasswordResetEmail({
        firstName: user.firstName,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/logowanie`
      })
    });

    if (resendError) {
      console.error(resendError);
      return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
