import { ScreenFormat, ViewingMode } from "@prisma/client";

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
