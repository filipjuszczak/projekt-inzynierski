"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import prisma from "@/lib/prisma";
import { createGenreFormSchema, type GenreValues } from "@/lib/validation";
import { authEmployee } from "@/app/(staff)/staff/auth";

export default async function createGenre(values: GenreValues) {
  try {
    const { session } = await authEmployee();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { name, ageRestriction } = createGenreFormSchema.parse(values);

    // check if genre with provided name already exists
    const existingGenre = await prisma.genre.findFirst({
      where: { name }
    });

    if (existingGenre) {
      return { error: "Gatunek o tej nazwie już istnieje" };
    }

    // create new genre
    await prisma.genre.create({
      data: {
        name,
        ageRestriction: Number(ageRestriction),
        createdBy: session.userId
      }
    });

    return redirect("/staff/dashboard/genres");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
