import { NextResponse, type NextRequest } from "next/server";
import ky from "ky";
import type { Session } from "lucia";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/staff/dashboard")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (!session || !session.userId) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/staff/login")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (requestSessionCookie) {
      const { session } = await ky
        .post(new URL("/api/auth/employee", request.url), {
          json: { sessionCookie: requestSessionCookie },
          headers: {
            secret: process.env.AUTH_API_SECREY_KEY
          }
        })
        .json<{ session: Session }>();

      if (session) {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/staff/change-password")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (!session) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/rejestracja",
    "/logowanie",
    "/zresetuj-haslo",
    {
      source: "/staff/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
