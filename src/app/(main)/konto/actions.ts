"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isValid as isValidDate } from "date-fns";
import { Role, UserActivities } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser, lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { allowedUsernameRegex, forbiddenUsernames } from "@/lib/utils";
import {
  updateAccountSettingsSchema,
  updateUserDataSchema,
  type UpdateAccountSettingsValues,
  type UpdateUserDataValues
} from "@/lib/validation/user";
import { cookies } from "next/headers";

export async function updateUserData(
  userId: string,
  values: UpdateUserDataValues
) {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      redirect("/logowanie");
    }

    const { user, session } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );

    if (!user || !session || !session.userId) {
      redirect("/logowanie");
    }

    if (userId !== user.id) {
      throw new Error("Unauthorized");
    }

    const lastDataUpdate = await prisma.userActivity.findFirst({
      where: {
        userId,
        type: UserActivities.DATA_CHANGED
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true }
    });

    if (lastDataUpdate) {
      const now = new Date();
      const fifteenMinutes = 15 * 60 * 1000;

      const diff = lastDataUpdate.createdAt.getTime() - now.getTime();

      if (diff < fifteenMinutes) {
        return {
          error:
            "Ostatnia aktualizacja danych miała miejsce mniej niż 15 minut temu. Odczekaj chwilę i spróbuj ponownie."
        };
      }
    }

    const { username, firstName, lastName, email, dateOfBirth } =
      updateUserDataSchema.parse(values);

    if (username) {
      if (!allowedUsernameRegex.test(username)) {
        return { error: "Nazwa użytkownika zawiera niedozwolone znaki." };
      }

      if (forbiddenUsernames.includes(username.toLowerCase())) {
        return { error: "Ta nazwa użytkownika jest zablokowana." };
      }
    }

    if (!isValidDate(dateOfBirth)) {
      return { error: "Nieprawidłowa data." };
    }

    const now = new Date();
    const diff = now.getTime() - dateOfBirth.getTime();
    const twelveYears = 12 * 365 * 24 * 60 * 60 * 1000;
    const isOldEnough = diff >= twelveYears;

    if (!isOldEnough) {
      return { error: "Musisz mieć co najmniej 12 lat." };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { username: true }
    });

    if (existingUsername) {
      return { error: "Nazwa użytkownika jest już zajęta." };
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });

    if (existingEmail && userId !== existingEmail.id) {
      return { error: "Użytkownik o podanym adresie email już istnieje." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        firstName,
        lastName,
        email,
        dateOfBirth
      },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        dateOfBirth: true
      }
    });

    return {
      success: true,
      userData: {
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        dateOfBirth: updatedUser.dateOfBirth,
        role: updatedUser.role
      }
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później." };
  }
}

export async function updateAccountSettings(
  userId: string,
  values: UpdateAccountSettingsValues
) {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      redirect("/logowanie");
    }

    const { user, session } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );

    if (!user || !session || !session.userId) {
      redirect("/logowanie");
    }

    if (userId !== user.id) {
      return { error: "Unauthorized" };
    }

    const lastNewsletterConsentUpdate = await prisma.userActivity.findFirst({
      where: {
        userId,
        type: {
          in: [
            UserActivities.NEWSLETTER_CONSENT_GRANTED,
            UserActivities.NEWSLETTER_CONSENT_REVOKED
          ]
        }
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true }
    });

    const { newsletterConsent } = updateAccountSettingsSchema.parse(values);

    if (lastNewsletterConsentUpdate) {
      const now = new Date();
      const fifteenMinutes = 15 * 60 * 1000;

      const diff =
        lastNewsletterConsentUpdate.createdAt.getTime() - now.getTime();

      if (diff < fifteenMinutes) {
        return {
          error:
            "Ostatnia aktualizacja ustawień konta miała miejsce mniej niż 15 minut temu. Odczekaj chwilę i spróbuj ponownie."
        };
      }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          newsletterConsent
        }
      }),
      prisma.userActivity.create({
        data: {
          userId,
          type: newsletterConsent
            ? UserActivities.NEWSLETTER_CONSENT_GRANTED
            : UserActivities.NEWSLETTER_CONSENT_REVOKED
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później." };
  }
}

export async function deleteAccount(userId: string) {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      redirect("/logowanie");
    }

    const { user, session } = await authenticateUser(
      Role.NORMAL,
      sessionCookie
    );

    if (!user || !session || !session.userId) {
      redirect("/logowanie");
    }

    if (userId !== user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.$transaction([
      prisma.userActivity.create({
        data: {
          userId,
          type: UserActivities.DELETED_ACCOUNT
        }
      }),
      prisma.session.deleteMany({
        where: { userId }
      }),
      prisma.user.delete({
        where: { id: userId }
      })
    ]);

    const blankSessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      blankSessionCookie.name,
      blankSessionCookie.value,
      blankSessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później." };
  }
}
