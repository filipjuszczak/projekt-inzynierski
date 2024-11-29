import { cookies } from "next/headers";

export async function getSessionCookie() {
  const requestCookies = await cookies();
  const requestSessionCookie = requestCookies.get("auth_session");

  if (!requestSessionCookie) {
    return null;
  }

  return requestSessionCookie;
}
