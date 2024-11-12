import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employeeId = (await params).id;
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
        userType: true
      }
    });

    return Response.json(employee);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
