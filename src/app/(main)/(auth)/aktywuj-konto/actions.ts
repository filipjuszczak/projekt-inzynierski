"use server";

import { TokenType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { createActivationToken, isValidEmail } from "@/lib/utils";
import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import AccountActivationConfirmationEmail from "@/components/emails/AccountActivationConfirmationEmail";

export async function activateAccount(
  email: string,
  token: string
): Promise<
  | { error: string; canRequestNewToken: boolean }
  | { error: string }
  | { success: boolean }
> {
  try {
    if (!email) {
      return { error: "Brak adresu e-mail.", canRequestNewToken: false };
    }

    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (!existingUser) {
      return {
        error: "Użytkownik o podanym adresie e-mail nie istnieje.",
        canRequestNewToken: false
      };
    }

    if (!token) {
      return { error: "Brak tokenu.", canRequestNewToken: false };
    }

    const existingToken = await prisma.token.findFirst({
      where: { value: token, type: TokenType.ACTIVATION }
    });

    if (!existingToken) {
      return { error: "Nieprawidłowy token.", canRequestNewToken: false };
    }

    if (!existingToken.isActive) {
      return { error: "Token został już użyty.", canRequestNewToken: false };
    }

    const tokenExpirationDate = new Date(existingToken.expiresAt);

    if (tokenExpirationDate < new Date()) {
      return { error: "Token wygasł.", canRequestNewToken: true };
    }

    await prisma.$transaction([
      prisma.token.update({
        where: { id: existingToken.id },
        data: { isActive: false }
      }),
      prisma.user.update({
        where: { id: existingToken.userId },
        data: { isActivated: true }
      })
    ]);

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - konto aktywowane!",
      react: AccountActivationConfirmationEmail({
        firstName: existingUser.firstName
      })
    });

    if (resendError) {
      console.error(resendError);
      return {
        error:
          "Wystąpił błąd podczas wysyłania e-mail'a. Spróbuj ponownie później."
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj ponownie później." };
  }
}

export async function requestNewToken(email: string) {
  try {
    if (!email) {
      return { error: "Brak adresu e-mail." };
    }

    if (!isValidEmail(email)) {
      return { error: "Niepoprawny adres e-mail." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return { error: "Użytkownik o podanym adresie e-mail nie istnieje." };
    }

    const existingToken = await prisma.token.findFirst({
      where: {
        userId: existingUser.id,
        type: TokenType.ACTIVATION
      },
      orderBy: { expiresAt: "desc" }
    });

    if (existingToken) {
      const now = new Date();
      const tokenExpirationDate = new Date(existingToken.expiresAt);

      if (now < tokenExpirationDate) {
        return {
          error:
            "Nowy token został niedawno wygenerowany. Sprawdź swoją skrzynkę pocztową lub odczekaj 15 minut, zanim utworzysz nowy link."
        };
      }
    }

    await prisma.token.update({
      where: {
        id: existingToken?.id
      },
      data: {
        isActive: false
      }
    });

    const { token: newToken, tokenExpiresAt } = createActivationToken();

    await prisma.token.create({
      data: {
        userId: existingUser.id,
        type: TokenType.ACTIVATION,
        value: newToken,
        expiresAt: tokenExpiresAt,
        isActive: true
      }
    });

    const encodedEmail = encodeURIComponent(email);
    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/aktywuj-konto?email=${encodedEmail}&token=${newToken}`;

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - witaj!",
      react: AccountActivationEmail({
        firstName: existingUser.firstName,
        link: activationLink
      })
    });

    if (resendError) {
      console.error(resendError);
      return {
        error:
          "Wystąpił błąd podczas wysyłania e-mail'a. Spróbuj ponownie później."
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
}
