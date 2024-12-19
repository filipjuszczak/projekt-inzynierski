import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import ky from "ky";
import type { Session } from "lucia";

async function getSession(request: NextRequest, apiEndpoint: string) {
  const sessionCookie = request.cookies.get("auth_session");
  if (!sessionCookie) return null;

  const { session } = await ky
    .post(new URL(apiEndpoint, request.url), {
      json: { sessionCookie },
      headers: { secret: process.env.AUTH_API_SECRET_KEY }
    })
    .json<{ session: Session }>();

  return session;
}

async function handleGuestSession(request: NextRequest) {
  const guestSessionCookie = request.cookies.get("guest_session");
  if (guestSessionCookie) return NextResponse.next();

  const { sessionId, expiresAt } = await ky
    .post(new URL("/api/create-guest-session", request.url), {
      headers: { secret: process.env.AUTH_API_SECRET_KEY }
    })
    .json<{ sessionId: string; expiresAt: number }>();

  const cookieStore = await cookies();
  if (sessionId) {
    cookieStore.set("guest_session", sessionId, { expires: expiresAt });
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/seans")) {
    const authSessionCookie = request.cookies.get("auth_session");
    if (!authSessionCookie) {
      return handleGuestSession(request);
    }
  }

  if (
    pathname === "/panel-pracownika" ||
    pathname.startsWith("/panel-pracownika/pulpit") ||
    pathname.startsWith("/panel-pracownika/zmien-haslo")
  ) {
    const session = await getSession(request, "/api/auth/employee");
    if (session && session.userId) {
      if (pathname === "/panel-pracownika") {
        return NextResponse.redirect(
          new URL("/panel-pracownika/pulpit", request.url)
        );
      }
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/panel-pracownika/logowanie", request.url)
    );
  }

  if (pathname.startsWith("/panel-pracownika/logowanie")) {
    const session = await getSession(request, "/api/auth/employee");
    if (session && session.userId) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/pulpit", request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/panel-pracownika/pulpit/pracownicy")) {
    const adminSession = await getSession(request, "/api/auth/admin");
    if (adminSession && adminSession.userId) {
      return NextResponse.next();
    }
    const employeeSession = await getSession(request, "/api/auth/employee");
    if (employeeSession && employeeSession.userId) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/pulpit", request.url)
      );
    }
    return NextResponse.redirect(
      new URL("/panel-pracownika/logowanie", request.url)
    );
  }

  if (pathname === "/rejestracja" || pathname === "/logowanie") {
    const session = await getSession(request, "/api/auth/user");
    if (session && session.userId) {
      return NextResponse.redirect(new URL("/konto", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/konto")) {
    const session = await getSession(request, "/api/auth/user");
    if (session && session.userId) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/logowanie", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
    // "/seans/:path*",
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // {
    //   source: "/rejestracja",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" }
    //   ]
    // },
    // {
    //   source: "/logowanie",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" }
    //   ]
    // },
    // {
    //   source: "/konto/:path*",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" }
    //   ]
    // },
    // {
    //   source: "/panel-pracownika/:path*",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" }
    //   ]
    // },
    // "/panel-pracownika/pulpit/pracownicy/:path*"
  ]
};
