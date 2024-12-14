import prisma from "@/lib/prisma";

export async function getShowtimeMetadata(id: string) {
  const showtime = await prisma.showtime.findUnique({
    where: { id },
    select: { id: true }
  });

  return { id: showtime?.id };
}
