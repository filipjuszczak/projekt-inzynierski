import { cache } from "react";
import { cookies } from "next/headers";
import { Lucia, type Session, type User } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      firstName: databaseUserAttributes.firstName,
      lastName: databaseUserAttributes.lastName,
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
      role: databaseUserAttributes.role,
      dateOfBirth: databaseUserAttributes.dateOfBirth,
      createdAt: databaseUserAttributes.createdAt
    };
  }
});

interface DatabaseUserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role: Role;
  dateOfBirth: Date;
  createdAt: Date;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const authenticateUser = cache(
  async (
    role: Role,
    cookie: {
      name: string;
      value: string;
    }
  ): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookie.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const result = await lucia.validateSession(sessionId);

    if (role === Role.ADMIN && result.user?.role !== Role.ADMIN) {
      return { user: null, session: null };
    }

    if (role === Role.EMPLOYEE && result.user?.role === Role.NORMAL) {
      return { user: null, session: null };
    }

    try {
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
