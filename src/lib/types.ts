import type {
  Genre,
  Movie,
  Role,
  Room,
  ScreenFormat,
  Showtime,
  TicketType,
  User,
  ViewingMode
} from "@prisma/client";

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
}

export type EssentialGenreData = Pick<Genre, "id" | "name" | "ageRestriction">;

export interface GenreWithMovieCount extends EssentialGenreData {
  _count: {
    movies: number;
  };
}

export interface MovieData
  extends Pick<Movie, "id" | "title" | "duration" | "releaseDate"> {
  viewingModes: {
    id: number;
    viewingMode: ViewingMode;
  }[];
  screenFormats: {
    id: number;
    screenFormat: ScreenFormat;
  }[];
  genres: EssentialGenreData[];
}

export interface ShowtimeData
  extends Pick<
    Showtime,
    "id" | "startTime" | "endTime" | "viewingMode" | "screenFormat"
  > {
  movie: Pick<Movie, "id" | "title">;
  room: Pick<Room, "id" | "number">;
}

export type EmployeeData = Pick<
  User,
  | "id"
  | "username"
  | "firstName"
  | "lastName"
  | "email"
  | "dateOfBirth"
  | "role"
>;

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
  page?: string;
  title?: string;
  genre?: string | string[];
  viewingMode?: ViewingMode | ViewingMode[];
  screenFormat?: ScreenFormat | ScreenFormat[];
}
