export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface Genre {
  id: string;
  name: string;
  ageRestriction: number;
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
  description: string;
  releaseYear: string;
  duration: string;
  genres: { genreId: string }[];
}

export interface Showtime {
  id: string;
  movie: Movie;
  room: Room;
  startDate: string;
  endDate: string;
}
