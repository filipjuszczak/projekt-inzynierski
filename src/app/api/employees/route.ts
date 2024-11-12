import prisma from "@/lib/prisma";
import { authEmployee } from "@/app/(staff)/staff/auth";
import { UserType } from "@prisma/client";

export async function GET() {
  try {
    const { user } = await authEmployee();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      where: {
        userType: {
          in: [UserType.EMPLOYEE, UserType.ADMIN]
        }
      },
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

    return Response.json(employees);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
