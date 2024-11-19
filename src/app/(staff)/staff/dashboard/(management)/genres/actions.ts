"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { authEmployee } from "@/app/(staff)/staff/auth";
import { getSessionCookie } from "@/app/(staff)/staff/session";
import prisma from "@/lib/prisma";
import { genreSchema, type GenreValues } from "@/lib/validation/genre";

export async function createGenre(values: GenreValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    const { session } = await authEmployee(requestSessionCookie);

    if (!session || !session.userId) {
      return redirect("/staff/login");
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

    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/dashboard/genres");
    revalidatePath("/staff/dashboard/movie/new");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editGenre(id: string, values: GenreValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    const { session } = await authEmployee(requestSessionCookie);

    if (!session || !session.userId) {
      return redirect("/staff/login");
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

    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/dashboard/genres");
    revalidatePath("/staff/dashboard/movie/new");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function deleteGenre(id: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    const { session } = await authEmployee(requestSessionCookie);

    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const existingGenre = await prisma.genre.findFirst({
      where: { id }
    });

    if (!existingGenre) {
      return { error: "Gatunek nie istnieje." };
    }

    await prisma.genre.delete({ where: { id } });

    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/dashboard/genres");
    revalidatePath("/staff/dashboard/movie/new");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
