import { authAdmin } from "@/app/(staff)/staff/auth";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("secret");

    if (secret !== process.env.AUTH_API_SECREY_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionCookie } = await request.json();

    const { session } = await authAdmin(sessionCookie);

    if (!session || !session.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ session });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
