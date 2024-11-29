import { Role } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";

export async function GET() {
  try {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) {
      return Response.json({ isAuthenticated: false });
    }

    const { session } = await authenticateUser(Role.NORMAL, sessionCookie);

    if (!session || !session.userId) {
      return Response.json({ isAuthenticated: false });
    }

    return Response.json({ isAuthenticated: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
