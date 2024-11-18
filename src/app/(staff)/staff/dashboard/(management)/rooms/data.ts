import prisma from "@/lib/prisma";

export async function getRooms() {
  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      number: true,
      numberOfRows: true,
      seatsPerRow: true
    }
  });

  if (!rooms.length) {
    return null;
  }

  return rooms;
}

export async function getRoomById(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      numberOfRows: true,
      seatsPerRow: true
    }
  });

  if (!room) {
    return null;
  }

  const upcomingShowtimes = await prisma.showtime.findMany({
    where: { roomId: id, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      movie: {
        select: {
          title: true
        }
      }
    }
  });

  return { room, upcomingShowtimes };
}

export async function getRoomsPromise() {
  return prisma.room.findMany({
    select: {
      id: true,
      number: true
    }
  });
}
