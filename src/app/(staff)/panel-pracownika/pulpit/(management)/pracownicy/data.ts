import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getEmployees() {
  const employees = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.EMPLOYEE, Role.ADMIN]
      }
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
      dateOfBirth: true,
      role: true
    }
  });

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
      role: true
    }
  });

  return employee;
}
