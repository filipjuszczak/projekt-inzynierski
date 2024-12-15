import prisma from "@/lib/prisma";

export async function getReservation(id: string) {
  const reservation = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      showtime: {
        select: {
          startTime: true,
          movie: {
            select: {
              title: true
            }
          },
          seats: {
            select: {
              id: true,
              rowNumber: true,
              seatNumber: true
            }
          },
          room: {
            select: {
              number: true
            }
          }
        }
      }
    }
  });

  if (!reservation) {
    return null;
  }

  return reservation;
}
