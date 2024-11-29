"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { genreSchema, type GenreValues } from "@/lib/validation/genre";

export async function createGenre(values: GenreValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { name, ageRestriction } = genreSchema.parse(values);

    const existingGenre = await prisma.genre.findFirst({
      where: { name }
    });

    if (existingGenre) {
      return { error: "Gatunek o tej nazwie już istnieje." };
    }

    await prisma.genre.create({
      data: {
        name,
        ageRestriction: Number(ageRestriction),
        createdBy: session.userId,
        updatedBy: null
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/movie/nowy");

  return { success: true };
}

export async function editGenre(id: string, values: GenreValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { name, ageRestriction } = genreSchema.parse(values);

    const existingGenre = await prisma.genre.findFirst({
      where: { name }
    });

    if (existingGenre && existingGenre.id !== id) {
      return { error: "Gatunek o tej nazwie już istnieje." };
    }

    await prisma.genre.update({
      where: { id },
      data: {
        name,
        ageRestriction: Number(ageRestriction),
        updatedBy: session.userId
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/movie/nowy");

  return { success: true };
}

export async function deleteGenre(id: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const existingGenre = await prisma.genre.findFirst({
      where: { id }
    });

    if (!existingGenre) {
      return { error: "Gatunek nie istnieje." };
    }

    await prisma.genre.delete({ where: { id } });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/panel-pracownika/pulpit");
  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/movie/nowy");

  return { success: true };
}
