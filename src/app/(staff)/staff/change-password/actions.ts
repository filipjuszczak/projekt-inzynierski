"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { hash, verify } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { authEmployee } from "@/app/(staff)/staff/auth";
import {
  changePasswordSchema,
  type ChangePasswordValues
} from "@/lib/validation/employee";
import { isValidEmail, passwordsMatch } from "@/lib/utils";
import PasswordChangedEmail from "@/components/emails/PasswordChangedEmail";

export async function changePassword(
  email: string,
  values: ChangePasswordValues
) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { newPassword, repeatNewPassword } =
      changePasswordSchema.parse(values);

    if (!passwordsMatch(newPassword, repeatNewPassword)) {
      return { error: "Hasła nie są takie same." };
    }

    if (!isValidEmail(email)) {
      return { error: "Nieprawidłowy adres email." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, passwordHash: true }
    });

    if (!existingUser) {
      return { error: "Nie znaleziono użytkownika o podanym adresie e-mail." };
    }

    const isPreviousPassword = await verify(
      existingUser.passwordHash,
      newPassword,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      }
    );

    if (isPreviousPassword) {
      return { error: "Hasło nie może być takie samo jak aktualne" };
    }

    const newPasswordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash: newPasswordHash, mustChangePassword: false }
    });

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - zmiana hasła",
      react: PasswordChangedEmail({ firstName: existingUser.firstName })
    });

    if (resendError) {
      return { error: "Nie udało się wysłać wiadomości e-mail." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
