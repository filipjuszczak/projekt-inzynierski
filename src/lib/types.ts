import type {
  Genre,
  Movie,
  Role,
  Room,
  ScreenFormat,
  Showtime,
  TicketType,
  User,
  ViewingMode,
  Order,
  OrderType
} from "@prisma/client";

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: Date;
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
    "id" | "startTime" | "endTime" | "viewingMode" | "screenFormat" | "status"
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

export interface UserReservation {
  id: string;
  type: OrderType;
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
  tickets: {
    type: string;
    price: number;
  }[];
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

export interface BookedSeat {
  id: string;
  rowNumber: number;
  seatNumber: number;
}

export type Step = "select-seats" | "select-tickets" | "summary";

export interface SelectedSeat {
  id: string;
  rowNumber: number;
  seatNumber: number;
  ticketType: TicketType;
}

export interface Reservation
  extends Pick<Order, "id" | "createdAt" | "isPaid" | "type"> {
  showtime: {
    movie: {
      title: string;
    };
    room: {
      number: string;
    };
    seats: {
      rowNumber: number;
      seatNumber: number;
    }[];
  };
  user: {
    firstName: string;
    lastName: string;
  } | null;
}
