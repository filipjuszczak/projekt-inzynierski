"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { authEmployee } from "@/app/(staff)/staff/auth";
import prisma from "@/lib/prisma";
import {
  createGenreFormSchema,
  editGenreFormSchema,
  type CreateGenreValues,
  type EditGenreValues
} from "@/lib/validation/genre";

export async function createGenre(values: CreateGenreValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { name, ageRestriction } = createGenreFormSchema.parse(values);

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
        createdBy: session.userId
      }
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editGenre(id: string, values: EditGenreValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { name, ageRestriction } = editGenreFormSchema.parse(values);

    if (name) {
      const existingGenre = await prisma.genre.findFirst({
        where: { name }
      });

      if (existingGenre && existingGenre.id !== id) {
        return { error: "Gatunek o tej nazwie już istnieje." };
      }
    }

    await prisma.genre.update({
      where: { id },
      data: { name, ageRestriction: Number(ageRestriction) }
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function deleteGenre(id: string) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    await prisma.genre.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
