import prisma from "@/lib/prisma";

export async function getRoomMetadata(id: string) {
  const room = await prisma.room.findUnique({
    where: {
      id
    },
    select: {
      number: true
    }
  });

  return {
    number: room?.number
  };
}
