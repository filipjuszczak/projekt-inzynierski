"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { hash, verify } from "@node-rs/argon2";
import { addMinutes, isValid as isValidDate } from "date-fns";
import { TokenType, UserActivities } from "@prisma/client";
import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import ConfirmPasswordResetEmail from "@/components/emails/ConfirmPasswordResetEmail";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import {
  forbiddenUsernames,
  isValidEmail,
  passwordsMatch,
  allowedUsernameRegex,
  createActivationToken
} from "@/lib/utils";
import { signupFormSchema, type SignupValues } from "@/lib/validation/auth";
import { HASHING_CONFIG } from "@/lib/constants";

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

    const hashedPassword = await hash(password, HASHING_CONFIG);

    const createdUser = await prisma.user.create({
      data: {
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth,
        password: hashedPassword,
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

    console.log(activationLink);

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
  password: true,
  role: true,
  isActivated: true,
  isLocked: true
};

export async function requestPasswordReset(email: string) {
  try {
    if (!isValidEmail(email)) {
      return { error: "Nieprawidłowy adres e-mail." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true }
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
    const encodedEmail = encodeURIComponent(email);
    const passwordResetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/zresetuj-haslo?step=set-password&email=${encodedEmail}&token=${token}`;

    console.log(passwordResetLink);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: {
          isLocked: true
        }
      }),
      prisma.token.create({
        data: {
          userId: existingUser.id,
          type: TokenType.PASSWORD_RESET,
          value: token,
          isActive: true,
          expiresAt: tokenExpiresAt
        }
      }),
      prisma.userActivity.create({
        data: {
          userId: existingUser.id,
          type: UserActivities.REQUESTED_PASSWORD_RESET
        }
      })
    ]);

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - reset hasła",
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

export async function setNewPassword(
  email: string,
  token: string,
  newPassword: string
) {
  try {
    const existingToken = await prisma.token.findFirst({
      where: { value: token, type: TokenType.PASSWORD_RESET, isActive: true },
      select: { id: true, userId: true, expiresAt: true }
    });

    if (!existingToken) {
      return { error: "Nieprawidłowy token." };
    }

    const user = await prisma.user.findFirst({
      where: { id: existingToken.userId, email },
      select: { id: true, password: true }
    });

    const tokenBelongsToUser = user && user.id === existingToken.userId;

    if (!tokenBelongsToUser) {
      return { error: "Nieprawidłowy token." };
    }

    if (new Date(existingToken.expiresAt) < new Date()) {
      return { error: "Token wygasł." };
    }

    const samePasswords = await verify(
      user.password,
      newPassword,
      HASHING_CONFIG
    );

    if (samePasswords) {
      return { error: "Nowe hasło musi się różnić od poprzedniego." };
    }

    const newHashedPassword = await hash(newPassword, HASHING_CONFIG);

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: existingToken.userId },
        data: {
          password: newHashedPassword,
          isLocked: false
        },
        select: {
          firstName: true,
          email: true
        }
      }),
      prisma.token.update({
        where: { id: existingToken.id },
        data: {
          isActive: false
        }
      }),
      prisma.userActivity.create({
        data: {
          userId: user.id,
          type: UserActivities.PASSWORD_CHANGED
        }
      })
    ]);

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [updatedUser.email],
      subject: "Cinema - hasło zostało zmienione",
      react: ConfirmPasswordResetEmail({
        firstName: updatedUser.firstName,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/logowanie`
      })
    });

    if (resendError) {
      console.error(resendError);
      return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
    }

    console.log("Password was successfully changed!");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
