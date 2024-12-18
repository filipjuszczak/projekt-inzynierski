import prisma from "@/lib/prisma";

export async function getReservation(id: string) {
  const reservation = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      showtime: {
        select: {
          startTime: true,
          movie: {
            select: {
              title: true
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

  const seats = await prisma.seat.findMany({
    where: { orderId: id, userId: reservation.userId }
  });

  const reservationWithSeats = {
    ...reservation,
    seats
  };

  return reservationWithSeats;
}
