import prisma from "@/lib/prisma";

export async function getEmployeeMetadata(id: string) {
  const employee = await prisma.user.findUnique({
    where: { id },
    select: { firstName: true, lastName: true }
  });

  return {
    firstName: employee?.firstName,
    lastName: employee?.lastName
  };
}
