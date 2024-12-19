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

export const MAX_UNSUCCESSFUL_LOGIN_ATTEMPTS = 5;

export const MAX_SELECTED_SEATS = 5;

export const HASHING_CONFIG = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1
};

export const VIEWING_MODE_LABELS = {
  [ViewingMode.SUBTITLES]: "Oryginalny (napisy)",
  [ViewingMode.DUBBING]: "Dubbing"
};

export const SCREEN_FORMAT_LABELS = {
  [ScreenFormat.TWO_D]: "2D",
  [ScreenFormat.THREE_D]: "3D",
  [ScreenFormat.IMAX]: "IMAX"
};

export const GENRE_LABELS = {
  0: "Brak ograniczenia wiekowego",
  12: "12+",
  15: "15+",
  18: "18+"
};

export const AGE_RESTRICTION_LABELS = {
  0: "Brak",
  12: "12+",
  15: "15+",
  18: "18+"
};

export const ROLE_LABELS = {
  [Role.ADMIN]: "Administrator",
  [Role.EMPLOYEE]: "Pracownik",
  [Role.NORMAL]: "Użytkownik"
};

export const TICKET_LABELS = {
  [TicketType.NORMAL]: "Normalny",
  [TicketType.REDUCED]: "Ulgowy"
};

export const RESERVATION_LABELS = {
  [OrderType.RESERVATION]: "Rezerwacja",
  [OrderType.PAID]: "Zakup"
};

export const SHOWTIME_STATUS_LABELS = {
  [ShowtimeStatus.UPCOMING]: "Nadchodzący",
  [ShowtimeStatus.ONGOING]: "Trwający",
  [ShowtimeStatus.FINISHED]: "Zakończony"
};

export const GENERIC_ERROR_MESSAGE =
  "Ups! Coś poszło nie tak. Spróbuj ponownie później.";

export const USER_ACTIVITIES = {
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
