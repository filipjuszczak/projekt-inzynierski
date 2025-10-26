import "dotenv";
import { Prisma } from "@prisma/client";
import { auth } from "../src/lib/auth/auth";
import prisma from "../src/lib/prisma";
import { ViewingMode, ScreenFormat } from "@prisma/client";

async function createAdmin() {
  return await auth.api.createUser({
    body: {
      name: "Admin",
      email: "admin@sunema.com",
      password: "password",
      role: "admin",
      data: {
        dateOfBirth: new Date("1970-01-01"),
        emailVerified: true
      }
    }
  });
}

async function createUser() {
  return await auth.api.createUser({
    body: {
      name: "Test User",
      email: "test@test.com",
      password: "password",
      role: "user",
      data: {
        dateOfBirth: new Date("1970-01-01")
      }
    }
  });
}

async function createGenre({
  name,
  ageRestriction,
  createdBy
}: Prisma.GenreCreateInput) {
  return await prisma.genre.create({
    data: {
      name,
      ageRestriction,
      createdBy
    },
    select: {
      id: true
    }
  });
}

async function createMovie({
  title,
  description,
  shortDescription,
  releaseDate,
  duration,
  posterUrl,
  isFeatured,
  createdBy
}: Prisma.MovieCreateInput) {
  return await prisma.movie.create({
    data: {
      title,
      description,
      shortDescription,
      releaseDate,
      duration,
      posterUrl,
      isFeatured,
      createdBy
    },
    select: {
      id: true
    }
  });
}

async function createMovieToGenre({
  movieId,
  genreId
}: Prisma.GenresOnMoviesCreateManyInput) {
  await prisma.genresOnMovies.create({
    data: {
      movieId,
      genreId
    }
  });
}

async function createMovieToViewingMode({
  movieId,
  viewingMode
}: Prisma.MovieViewingModeCreateManyInput) {
  await prisma.movieViewingMode.create({
    data: {
      movieId,
      viewingMode
    }
  });
}

async function createMovieToScreenFormat({
  movieId,
  screenFormat
}: Prisma.MovieScreenFormatCreateManyInput) {
  await prisma.movieScreenFormat.create({
    data: {
      movieId,
      screenFormat
    }
  });
}

async function main() {
  const [admin, user] = await Promise.all([createAdmin(), createUser()]);
  console.log("Admin and user created successfully!");

  console.log("Creating 2 genres...");
  const [genre1, genre2] = await Promise.all([
    createGenre({ name: "akcja", ageRestriction: 0, createdBy: admin.user.id }),
    createGenre({
      name: "thriller",
      ageRestriction: 18,
      createdBy: user.user.id
    })
  ]);
  console.log("Creating 2 genres successful!");

  console.log("Creating movie...");
  const movie = await createMovie({
    title: "Test Movie",
    description: "Test description",
    shortDescription: "Test short description",
    releaseDate: new Date("1970-01-01"),
    duration: 120,
    posterUrl: "http://example.com/img/abc",
    isFeatured: false,
    createdBy: admin.user.id
  });
  console.log("Creating movie successful!");

  console.log("Linking genres to movie...");
  await Promise.all([
    createMovieToGenre({ movieId: movie.id, genreId: genre1.id }),
    createMovieToGenre({ movieId: movie.id, genreId: genre2.id })
  ]);
  console.log("Linking genres to movie successful!");

  const viewingModesPromises = Object.values(ViewingMode).map((vm) =>
    createMovieToViewingMode({ movieId: movie.id, viewingMode: vm })
  );

  const screenFormatsPromises = Object.values(ScreenFormat).map((sf) =>
    createMovieToScreenFormat({ movieId: movie.id, screenFormat: sf })
  );

  console.log("Creating viewing modes and screen formats...");
  await Promise.all([...viewingModesPromises, ...screenFormatsPromises]);
  console.log("Creating viewing modes and screen formats successful!");
}

main();
