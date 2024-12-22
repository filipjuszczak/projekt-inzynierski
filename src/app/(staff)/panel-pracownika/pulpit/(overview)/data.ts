import prisma from "@/lib/prisma";

export async function getRecentlyAddedGenres() {
  const genres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true,
      ageRestriction: true,
      createdAt: true,
      _count: {
        select: {
          movies: true
        }
      }
    },
    take: 4,
    orderBy: {
      createdAt: "desc"
    }
  });

  return genres;
}

export async function getRecentlyAddedMovies() {
  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
              ageRestriction: true
            }
          }
        }
      }
    },
    take: 5,
    orderBy: {
      createdAt: "desc"
    }
  });

  const flattenedMovies = movies.map((movie) => ({
    ...movie,
    genres: movie.genres.map((genre) => genre.genre)
  }));

  return flattenedMovies;
}

export async function getShowtimesToday() {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      showtimes: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true
        },
        where: {
          startTime: {
            gte: midnight,
            lte: endOfDay
          }
        },
        orderBy: {
          startTime: "asc"
        }
      }
    }
  });

  const moviesWithShowtimes = movies.filter(
    (movie) => movie.showtimes.length > 0
  );

  return moviesWithShowtimes;
}

export async function getAllSales() {
  const tickets = await prisma.ticket.findMany({
    select: {
      price: true
    }
  });

  const totalSales = tickets.reduce(
    (sum, ticket) => sum + ticket.price / 100,
    0
  );

  return totalSales;
}

export async function getTotalTicketsSold() {
  const ticketCount = await prisma.ticket.count({
    where: {
      order: {
        isPaid: true
      }
    }
  });

  return ticketCount;
}

export async function getOccupancy() {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const showtimesToday = await prisma.showtime.findMany({
    where: {
      startTime: {
        gte: midnight,
        lte: endOfDay
      }
    },
    select: {
      id: true,
      _count: {
        select: {
          seats: true
        }
      }
    }
  });

  if (showtimesToday.length === 0) {
    return null;
  }

  const rooms = await prisma.room.findMany({
    select: {
      numberOfRows: true,
      seatsPerRow: true
    }
  });

  const totalSeats = rooms.reduce(
    (sum, room) => sum + room.numberOfRows * room.seatsPerRow,
    0
  );

  const occupancy = showtimesToday.reduce(
    (sum, showtime) => sum + showtime._count.seats,
    0
  );

  return (occupancy / totalSeats) * 100;
}
