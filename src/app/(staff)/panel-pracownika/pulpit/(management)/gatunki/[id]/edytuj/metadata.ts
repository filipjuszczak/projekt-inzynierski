import prisma from "@/lib/prisma";

export async function getGenreMetadata(id: string) {
  const genre = await prisma.genre.findUnique({
    where: { id },
    select: { name: true }
  });

  return { name: genre?.name };
}
