"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import prisma from "@/lib/prisma";
import { editGenreFormSchema, type GenreValues } from "@/lib/validation";

export default async function editGenre(
  id: string,
  values: Partial<GenreValues>
) {
  try {
    const { name, ageRestriction } = editGenreFormSchema.parse(values);

    if (name) {
      const existingGenre = await prisma.genre.findFirst({
        where: { name }
      });

      if (existingGenre && existingGenre.id !== id) {
        return { error: "Gatunek o tej nazwie już istnieje" };
      }
    }

    await prisma.genre.update({
      where: { id },
      data: { name, ageRestriction: Number(ageRestriction) }
    });

    return redirect("/staff/dashboard/genres");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
