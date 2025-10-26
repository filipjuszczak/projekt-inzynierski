import {
  OrderType,
  Role,
  ScreenFormat,
  ShowtimeStatus,
  TicketType,
  ViewingMode,
  UserActivities
} from "@prisma/client";
import {
  BookOpen,
  CircleCheck,
  CircleX,
  FileText,
  KeyRound,
  MailCheck,
  MailX
} from "lucide-react";

export const TIME_ZONE = "Europe/Warsaw";

export const MAX_SELECTED_SEATS = 5;

export const VIEWING_MODE_LABELS = {
  [ViewingMode.SUBTITLES]: "Oryginalny (napisy)",
  [ViewingMode.DUBBING]: "Dubbing"
} as const;

export const SCREEN_FORMAT_LABELS = {
  [ScreenFormat.TWO_D]: "2D",
  [ScreenFormat.THREE_D]: "3D",
  [ScreenFormat.IMAX]: "IMAX"
} as const;

export const GENRE_LABELS = {
  0: "Brak ograniczenia wiekowego",
  12: "12+",
  15: "15+",
  18: "18+"
} as const;

export const AGE_RESTRICTION_LABELS = {
  0: "Brak",
  12: "12+",
  15: "15+",
  18: "18+"
} as const;

export const ROLE_LABELS = {
  [Role.admin]: "Administrator",
  [Role.employee]: "Pracownik",
  [Role.user]: "Użytkownik"
} as const;

export const TICKET_LABELS = {
  [TicketType.NORMAL]: "Normalny",
  [TicketType.REDUCED]: "Ulgowy"
} as const;

export const RESERVATION_LABELS = {
  [OrderType.RESERVATION]: "Rezerwacja",
  [OrderType.PAID]: "Zakup"
} as const;

export const SHOWTIME_STATUS_LABELS = {
  [ShowtimeStatus.UPCOMING]: "Nadchodzący",
  [ShowtimeStatus.ONGOING]: "Trwający",
  [ShowtimeStatus.FINISHED]: "Zakończony"
} as const;

export const GENERIC_ERROR_MESSAGE =
  "Ups! Coś poszło nie tak. Spróbuj ponownie później.";

export const USER_ACTIVITIES = {
  [UserActivities.DELETED_ACCOUNT]: {
    icon: CircleX,
    text: "Usunięcie konta"
  },
  [UserActivities.PASSWORD_CHANGED]: {
    icon: KeyRound,
    text: "Zmiana hasła"
  },
  [UserActivities.PASSWORD_RESET]: {
    icon: KeyRound,
    text: "Reset hasła"
  },
  [UserActivities.PERSONAL_DATA_CHANGED]: {
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
} as const;

export const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

export const FIFTEEN_MINUTES_IN_MS = 1000 * 60 * 15;

export const PAGE_SIZE = 8;

export const FIRST_MOVIE_RELEASE_YEAR = 1888;

export const BREAK_BETWEEN_SHOWTIMES = 15 * 60 * 1000;

export const DEFAULT_EMAIL_SENDER =
  "Sunema <notifications@notifications.filipjuszczak.pl>";
