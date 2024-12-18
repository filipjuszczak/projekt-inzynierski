import prisma from "@/lib/prisma";

export async function getReservations() {
  const reservations = await prisma.order.findMany({
    select: {
      id: true,
      isPaid: true,
      type: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      showtime: {
        select: {
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
          // seats: {
          //   select: {
          //     rowNumber: true,
          //     seatNumber: true
          //   }
          // }
        }
      }
    }
  });

  const reservationsWithSeats = [];

  for (const reservation of reservations) {
    const seats = await prisma.seat.findMany({
      where: {
        orderId: reservation.id
      },
      select: {
        rowNumber: true,
        seatNumber: true
      }
    });

    reservationsWithSeats.push({
      ...reservation,
      showtime: {
        ...reservation.showtime,
        seats
      }
    });
  }

  return reservationsWithSeats;
}
