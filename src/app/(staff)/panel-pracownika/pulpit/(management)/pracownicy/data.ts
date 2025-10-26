import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getEmployees() {
  const employees = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.employee, Role.admin]
      }
    },
    select: {
      id: true,
      name: true,
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
      name: true,
      email: true,
      dateOfBirth: true,
      role: true
    }
  });

  return employee;
}
