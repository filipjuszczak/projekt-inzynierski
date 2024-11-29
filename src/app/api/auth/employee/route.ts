import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("secret");

    if (secret !== process.env.AUTH_API_SECREY_KEY) {
      return Response.json({ error: "Unauthorized" });
    }

    const { sessionCookie } = await request.json();

    const { session } = await authenticateUser(Role.EMPLOYEE, sessionCookie);

    if (!session || !session.userId) {
      return Response.json({ error: "Unauthorized" });
    }

    return Response.json({ session });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
