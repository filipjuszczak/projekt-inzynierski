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
          },
          seats: {
            select: {
              rowNumber: true,
              seatNumber: true
            }
          }
        }
      }
    }
  });

  return reservations;
}
