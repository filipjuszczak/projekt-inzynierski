import { NextResponse, type NextRequest } from "next/server";
import ky from "ky";
import type { Session } from "lucia";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/panel-pracownika") {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/logowanie", request.url)
      );
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session && session.userId) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/pulpit", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/panel-pracownika/logowanie", request.url)
    );
  }

  if (request.nextUrl.pathname.startsWith("/panel-pracownika/pulpit")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/logowanie", request.url)
      );
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session && session.userId) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/panel-pracownika/logowanie", request.url)
    );
  }

  if (request.nextUrl.pathname.startsWith("/panel-pracownika/logowanie")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.next();
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session && session.userId) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/pulpit", request.url)
      );
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/panel-pracownika/zmien-haslo")) {
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(
        new URL("/panel-pracownika/logowanie", request.url)
      );
    }

    const { session } = await ky
      .post(new URL("/api/auth/employee", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/panel-pracownika/logowanie", request.url)
    );
  }

  if (request.nextUrl.pathname.startsWith("/rejestracja")) {
    console.log("Middleware for /rejestracja running...");
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.next();
    }

    const { session } = await ky
      .post(new URL("/api/auth/user", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session && session.userId) {
      return NextResponse.redirect(new URL("/konto", request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/logowanie")) {
    console.log("Middleware for /logowanie running...");
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.next();
    }

    const { session } = await ky
      .post(new URL("/api/auth/user", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

    if (session && session.userId) {
      return NextResponse.redirect(new URL("/konto", request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/konto")) {
    console.log("Middleware for /konto running...");
    const requestSessionCookie = request.cookies.get("auth_session");

    if (!requestSessionCookie) {
      return NextResponse.redirect(new URL("/logowanie", request.url));
    }

    const { session } = await ky
      .post(new URL("/api/auth/user", request.url), {
        json: { sessionCookie: requestSessionCookie },
        headers: {
          secret: process.env.AUTH_API_SECREY_KEY
        }
      })
      .json<{ session: Session }>();

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
      source: "/rejestracja",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },
    {
      source: "/logowanie",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },
    {
      source: "/konto/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },
    {
      source: "/panel-pracownika/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
