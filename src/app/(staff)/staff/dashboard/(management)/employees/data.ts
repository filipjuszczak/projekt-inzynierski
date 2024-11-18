import { UserType } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getEmployees() {
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

  if (!employees.length) {
    return null;
  }

  return employees;
}

export async function getEmployeeById(id: string) {
  const employee = await prisma.user.findUnique({
    where: { id },
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

  return employee;
}
