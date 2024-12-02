import type {
  Role,
  ScreenFormat,
  TicketType,
  ViewingMode
} from "@prisma/client";

export interface UserData {
  success: boolean;
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: Role;
  };
}

export interface Genre {
  id: string;
  name: string;
  ageRestriction: number;
}

export interface GenreWithMovieCount extends Genre {
  _count: {
    movies: number;
  };
}

export interface Room {
  id: string;
  number: string;
  numberOfRows: number;
  seatsPerRow: number;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string | null;
  description: string;
  releaseDate: Date;
  duration: number;
  viewingModes: {
    id: number;
    viewingMode: ViewingMode;
  }[];
  screenFormats: {
    id: number;
    screenFormat: ScreenFormat;
  }[];
  genres: Genre[];
}

export interface Showtime {
  id: string;
  movie: {
    id: string;
    title: string;
  };
  room: {
    id: string;
    number: string;
  };
  startTime: Date;
  endTime: Date;
  screenFormat: ScreenFormat;
  viewingMode: ViewingMode;
}

export interface Employee {
  id: string;
  username: string | null;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  role: Role;
}

export interface Reservation {
  id: string;
  createdAt: Date;
  showtime: {
    room: {
      number: string;
    };
    movie: {
      id: string;
      title: string;
    };
    startTime: Date;
  };
  seats: {
    rowNumber: number;
    seatNumber: number;
  }[];
  ticket: {
    ticketType: TicketType;
    price: number;
  };
}

export type Cursor = string | null;

export interface MoviesPage {
  movies: {
    genres: string[];
    viewingModes: ViewingMode[];
    screenFormats: ScreenFormat[];
    title: string;
    id: string;
    shortDescription: string;
    releaseDate: Date;
    duration: number;
    posterUrl: string | null;
  }[];
  nextCursor: Cursor;
}

export interface Filters {
  title?: string;
  genre?: string | string[];
  viewingMode?: ViewingMode | ViewingMode[];
  screenFormat?: ScreenFormat | ScreenFormat[];
}
