import type { Role } from "@prisma/client";

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
  genres: Genre[];
}

export interface EditMovieValues {
  title: string;
  description: string;
  releaseDate: Date;
  duration: string;
  genres: { genreId: string }[];
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
