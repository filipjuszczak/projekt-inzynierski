import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { UploadThingError } from "uploadthing/server";
import { auth } from "./auth";
import prisma from "../prisma";

type AuthOptions = {
  returnError?: boolean;
  throwUploadThingError?: boolean;
  returnRedirect?: boolean;
};

async function handleAuthError(
  message: string,
  status: number,
  redirectPath: string,
  options: AuthOptions
) {
  if (options.returnError) {
    return NextResponse.json({ error: message }, { status });
  }
  if (options.throwUploadThingError) {
    throw new UploadThingError("Unauthorized");
  }
  return redirect(redirectPath);
}

async function baseAuth(options: AuthOptions = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return handleAuthError("Unauthorized", 401, "/logowanie", options);
  }

  return session;
}

export async function authUser(options: AuthOptions = {}) {
  const session = await baseAuth(options);
  if (session instanceof NextResponse) return session;
  return session;
}

export async function authEmployee(options: AuthOptions = {}) {
  const session = await baseAuth(options);
  if (session instanceof NextResponse) return session;

  const validRoles = ["admin", "employee"];
  if (!validRoles.includes(session.user.role ?? "")) {
    return handleAuthError(
      "Forbidden",
      403,
      "/panel-pracownika/logowanie",
      options
    );
  }

  return session;
}

export async function authAdmin(options: AuthOptions = {}) {
  const session = await baseAuth(options);
  if (session instanceof NextResponse) return session;

  if (session.user.role !== "admin") {
    const redirectPath = options.returnRedirect
      ? "/panel-pracownika/logowanie"
      : "/panel-pracownika/pulpit";
    return handleAuthError("Forbidden", 403, redirectPath, options);
  }

  return session;
}

export async function validateBuySession() {
  const cookieJar = await cookies();
  const buySessionId = cookieJar.get("buy_session_id");

  if (!buySessionId) {
    return Response.json({ error: "Brak ciasteczka sesji." }, { status: 400 });
  }

  const buySession = await prisma.buySession.findFirst({
    select: {
      id: true,
      expiresAt: true
    },
    where: {
      id: buySessionId.value
    }
  });

  if (!buySession) {
    return Response.json({ error: "Sesja nie istnieje." }, { status: 404 });
  }

  const now = Date.now();
  const buySessionExpiresAt = buySession.expiresAt.getTime();

  if (buySessionExpiresAt < now) {
    return Response.json({ error: "Sesja wygasła." }, { status: 401 });
  }

  return buySession;
}
