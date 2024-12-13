import {
  BookOpen,
  CircleCheck,
  CircleX,
  FileText,
  KeyRound,
  MailCheck,
  MailX
} from "lucide-react";
import { UserActivities } from "@prisma/client";
import prisma from "@/lib/prisma";

const USER_ACTIVITIES = {
  [UserActivities.ACTIVATED_ACCOUNT]: {
    icon: CircleCheck,
    text: "Aktywacja konta"
  },
  [UserActivities.DELETED_ACCOUNT]: {
    icon: CircleX,
    text: "Usunięcie konta"
  },
  [UserActivities.PASSWORD_CHANGED]: {
    icon: KeyRound,
    text: "Zmiana hasła"
  },
  [UserActivities.REQUESTED_PASSWORD_RESET]: {
    icon: KeyRound,
    text: "Prośba o reset hasła"
  },
  [UserActivities.DATA_CHANGED]: {
    icon: FileText,
    text: "Aktualizacja danych"
  },
  [UserActivities.CREATED_RESERVATION]: {
    icon: BookOpen,
    text: "Utworzenie rezerwacji"
  },
  [UserActivities.NEWSLETTER_CONSENT_GRANTED]: {
    icon: MailCheck,
    text: "Przyznanie zgody na newsletter"
  },
  [UserActivities.NEWSLETTER_CONSENT_REVOKED]: {
    icon: MailX,
    text: "Wycofanie zgody na newsletter"
  }
};

export async function getRecentUserActivity(userId: string) {
  const recentUserActivity = await prisma.userActivity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      type: true,
      createdAt: true
    },
    take: 3
  });

  const result = [];

  for (const activity of recentUserActivity) {
    result.push({
      icon: USER_ACTIVITIES[activity.type].icon,
      text: USER_ACTIVITIES[activity.type].text,
      date: activity.createdAt
    });
  }

  return result;
}

export async function getUserAccountSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { newsletterConsent: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return { newsletterConsent: user.newsletterConsent };
}

export async function getReservations(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      createdAt: true,
      seats: {
        select: {
          rowNumber: true,
          seatNumber: true
        }
      },
      showtime: {
        select: {
          movie: {
            select: {
              id: true,
              title: true
            }
          },
          room: {
            select: {
              number: true
            }
          },
          startTime: true
        }
      },
      tickets: {
        select: {
          type: true,
          price: true
        }
      }
    }
  });

  return orders;
}

export async function getReservationsStats(userId: string) {
  const allReservations = await prisma.order.findMany({
    where: {
      userId
    },
    select: {
      showtime: {
        select: {
          movie: {
            select: {
              genres: {
                select: {
                  genre: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          },
          startTime: true
        }
      }
    }
  });

  const genreCount: { [key: string]: number } = {};
  let favoriteGenre = null;

  if (allReservations.length > 0) {
    for (const reservation of allReservations) {
      const genres = reservation.showtime.movie.genres.map(
        (genre) => genre.genre.name
      );

      for (const genre of genres) {
        if (genreCount[genre]) {
          genreCount[genre]++;
        } else {
          genreCount[genre] = 1;
        }
      }
    }

    let currentMax = 0;

    for (const [genreName, count] of Object.entries(genreCount)) {
      if (count > currentMax) {
        currentMax = count;
        favoriteGenre = genreName;
      }
    }
  }

  return { allReservations, favoriteGenre };
}
