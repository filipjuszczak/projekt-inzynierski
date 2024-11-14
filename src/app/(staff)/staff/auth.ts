import { cache } from "react";
import { cookies } from "next/headers";
import { UserType } from "@prisma/client";
import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import type { Session, User } from "lucia";

export const authEmployee = cache(
  async (): Promise<
    | { user: User; session: Session; mustChangePassword: boolean }
    | { user: null; session: null }
  > => {
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const validationResult = await lucia.validateSession(sessionId);
    const result = { ...validationResult, mustChangePassword: false };

    try {
      if (validationResult.user?.userType === UserType.NORMAL) {
        return { user: null, session: null };
      }

      const user = await prisma.user.findUnique({
        where: { id: validationResult.user?.id },
        select: { mustChangePassword: true }
      });

      if (validationResult.session && validationResult.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(
          validationResult.session.id
        );
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!validationResult.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (user && user.mustChangePassword) {
        result.mustChangePassword = true;
      }
    } catch {}

    return result;
  }
);

export const authAdmin = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.user?.userType !== UserType.ADMIN) {
        return { user: null, session: null };
      }

      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);
