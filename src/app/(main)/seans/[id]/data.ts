import prisma from "@/lib/prisma";

export async function getEssentialShowtimeDataById(id: string) {
  const showtime = await prisma.showtime.findUnique({
    where: { id },
    select: {
      id: true,
      startTime: true,
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          shortDescription: true,
          genres: {
            select: {
              genre: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      },
      room: {
        select: {
          id: true,
          numberOfRows: true,
          seatsPerRow: true
        }
      },
      seats: {
        select: {
          id: true,
          rowNumber: true,
          seatNumber: true
        }
      }
    }
  });

  if (!showtime) {
    return null;
  }

  const flattenedShowtime = {
    ...showtime,
    movie: {
      ...showtime.movie,
      genres: showtime.movie.genres.map(({ genre }) => genre)
    }
  };

  return flattenedShowtime;
}

export async function getTickets() {
  const tickets = await prisma.ticketInfo.findMany({
    select: {
      id: true,
      type: true,
      price: true
    }
  });

  const ticketTypes = tickets.reduce(
    (acc, ticket) => {
      acc[ticket.type] = {
        price: ticket.price
      };
      return acc;
    },
    {} as Record<string, { price: number }>
  );

  return ticketTypes;
}
