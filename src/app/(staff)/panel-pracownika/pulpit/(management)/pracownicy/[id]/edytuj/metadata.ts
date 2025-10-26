import prisma from "@/lib/prisma";

export async function getEmployeeMetadata(id: string) {
  const employee = await prisma.user.findUnique({
    where: { id },
    select: { name: true }
  });

  const [firstName, lastName] = employee?.name.split(" ") || ["", ""];

  return {
    firstName: firstName,
    lastName: lastName
  };
}
