import { TokenType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { createActivationToken, isValidEmail } from "@/lib/utils";
import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import type { NextRequest } from "next/server";
import { addMinutes } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email) {
      return Response.json({ error: "Brak adresu e-mail." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Niepoprawny adres e-mail." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return Response.json(
        { error: "Użytkownik o podanym adresie e-mail nie istnieje." },
        { status: 404 }
      );
    }

    const existingToken = await prisma.token.findFirst({
      where: {
        userId: existingUser.id,
        value: token,
        type: TokenType.ACTIVATION
      },
      orderBy: { expiresAt: "desc" }
    });

    if (
      existingToken &&
      new Date(existingToken.expiresAt) > addMinutes(new Date(), -15)
    ) {
      return Response.json(
        {
          error:
            "Nowy token został niedawno wygenerowany. Sprawdź swoją skrzynkę pocztową lub odczekaj 15 minut, zanim utworzysz nowy link."
        },
        { status: 400 }
      );
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
    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/activate-account?email=${encodedEmail}&token=${newToken}`;

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Welcome to our cinema!",
      react: AccountActivationEmail({
        firstName: existingUser.firstName,
        link: activationLink
      })
    });

    if (resendError) {
      console.error(resendError);
      return Response.json(
        { error: "Ups! Coś poszło nie tak. Spróbuj później." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
