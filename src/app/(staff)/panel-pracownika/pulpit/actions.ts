"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
// import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { authEmployee } from "@/lib/auth/helpers";

export async function setFeaturedMovie(movieId: string) {
  try {
    await authEmployee({ returnRedirect: true });

    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!existingMovie) {
      return { error: "Wybrany film nie istnieje." };
    }

    const currentFeaturedMovie = await prisma.movie.findFirst({
      where: { isFeatured: true },
      select: { id: true }
    });

    if (currentFeaturedMovie) {
      await prisma.movie.update({
        where: { id: currentFeaturedMovie.id },
        data: { isFeatured: false }
      });
    }

    await prisma.movie.update({
      where: { id: movieId },
      data: { isFeatured: true }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/");

  return { success: true };
}
