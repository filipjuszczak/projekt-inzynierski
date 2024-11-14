import type { UserType } from "@prisma/client";

export interface UserData {
  success: boolean;
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    userType: UserType;
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
  number: number;
  numberOfRows: number;
  seatsPerRow: number;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description: string;
  releaseYear: string;
  duration: number;
  genres: Genre[];
}

export interface MovieWithGenres extends Movie {
  genres: Genre[];
}

export interface EditMovieValues {
  title: string;
  // posterUrl: string;
  description: string;
  releaseDate: string;
  duration: string;
  genres: { genreId: string }[];
}

export interface Showtime {
  id: string;
  movie: Movie;
  room: Room;
  startTime: string;
  endTime: string;
}

export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  userType: UserType;
}
